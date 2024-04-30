# 使用官方Node.js 18版本作为基础镜像
FROM node:18.16.0

# 设置容器内的工作目录
WORKDIR /app

# 复制package.json和package-lock.json到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目中的所有文件到工作目录
COPY . .

# 容器对外开放5000端口
EXPOSE 5000

# 定义容器启动时执行的命令
CMD ["node", "app.js"]
