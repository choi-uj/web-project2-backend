FROM mysql:8.0

# 환경변수 설정 (보안을 위해 Render 환경 변수로도 설정 가능)
ENV MYSQL_ROOT_PASSWORD=1234
ENV MYSQL_DATABASE=work
ENV MYSQL_USER=myuser
# 루트는 배포할 때는 사용 금지
ENV MYSQL_PASSWORD=mypassword
EXPOSE 3306