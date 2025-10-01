import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json()); // POST 요청에서 JSON 본문을 처리하도록 설정
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};
app.use(cors(corsOptions));

const db = mysql.createConnection({
    // host: "localhost",
    // user: "root",
    // password: "1234",
    // database: "work"
    host: process.env.DB_HOST,
    user: process.env.DB_USER || 'myuser',
    password: process.env.DB_PASSWORD || 'mypassword',
    database: process.env.DB_NAME || 'work'
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

app.get("/web2_full/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT id, username, title, content FROM web2_full WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "서버 오류" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }
    res.json(results[0]);
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


// 게시글 수정 API (비밀번호 확인 후 수정)
app.put("/web2_full/:id", (req, res) => {
  const id = req.params.id;
  const { password, title, content } = req.body;

  // 1) 우선 해당 게시글의 비밀번호 조회
  const selectSql = "SELECT password FROM web2_full WHERE id = ?";
  db.query(selectSql, [id], (err, results) => {
    if (err) {
      console.error("비밀번호 조회 실패:", err);
      return res.status(500).json({ error: "서버 오류" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    const dbPassword = results[0].password;
    if (dbPassword !== password) {
      // 비밀번호 불일치
      return res.status(403).json({ error: "비밀번호가 일치하지 않습니다." });
    }

    // 2) 비밀번호 일치하면 수정 진행
    const updateSql = "UPDATE web2_full SET title = ?, content = ? WHERE id = ?";
    db.query(updateSql, [title, content, id], (updateErr, updateResult) => {
      if (updateErr) {
        console.error("수정 실패:", updateErr);
        return res.status(500).json({ error: "수정 중 오류가 발생했습니다." });
      }
      return res.json({ message: "게시글이 성공적으로 수정되었습니다." });
    });
  });
});

app.delete("/web2_full/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM web2_full WHERE id = ?";
  db.query(sql, [id], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "삭제 완료" });
  });
});


// 서버 실행
const PORT = process.env.PORT || 8500;
app.listen(PORT, () => {
  console.log(`서버 실행 중! 포트: ${PORT}`);
});
