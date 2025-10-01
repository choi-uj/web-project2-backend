import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json()); // POST 요청에서 JSON 본문을 처리하도록 설정
const allowedOrigins = [
  "http://localhost:5173", // 로컬 개발용
  "https://web-project2-frontend.vercel.app/" // Vercel에 배포된 프론트 주소
];

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true
};
app.use(cors(corsOptions));

const db = mysql.createConnection({
    // host: "localhost",
    // user: "root",
    // password: "1234",
    // database: "work"
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
// MySQL 연결 확인
db.connect((err) => {
    if (err) {
        console.error("MySQL 연결 실패:", err);
        return;
    }
    console.log("MySQL 연결 성공!");
});
//get 요청 보내기
app.get("/", (req,res)=>{
    res.json(" 백앤드 부분입니다. 환영해요 정말로~~");
});

app.get("/web2_full", (req, res) => {
    // console.log("웹2_풀 API 요청 들어옴");  // 요청이 들어오는지 확인하는 로그 추가
    const sql = "SELECT * FROM web2_full";  // web2_full 테이블 조회
    db.query(sql, (err, data) => {
        if (err) {
            console.error("쿼리 실행 오류:", err);  // 쿼리 오류 출력
            return res.status(500).json(err);
        }
        // console.log("쿼리 실행 결과:", data);  // 데이터가 제대로 반환되었는지 확인
        return res.json(data);  // 결과 반환
    });
});

// POST 요청 처리 (새로운 데이터 삽입)
app.post("/web2_full", (req, res)=>{
    const sql = "insert into web2_full( username, password, title, content ) values (?,?,?,?)";
    // const values = ['back2씨','4443','제목4', '내용4'];
    const values = [req.body.username, req.body.password, req.body.title, req.body.content];

    db.query( sql, values, (err, data)=>{
        if(err) {
            // return res.json(err);
            console.error("삽입 에러:", err);
            return res.status(500).json({ error: "DB 삽입 실패", detail: err });
        }
        // return res.json(data);
        return res.status(201).json({ message: "작성 완료", data });
    });
});

// 서버 실행
const PORT = process.env.PORT || 8500;
// app.listen(8500, () => {
//     console.log("백앤드 연결 성공!!");
// });
app.listen(PORT, () => {
  console.log(`서버 실행 중! 포트: ${PORT}`);
});

