const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// 帮助函数：验证 JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];  // 从 Authorization 头中取得 token

    if (token == null) {
        return res.sendStatus(401);  // 如果没有 token，则返回 401 未授权
    }

    jwt.verify(token, 'your_secret_key', (err, user) => {
        if (err) {
            return res.sendStatus(403);  // 如果 token 不合法或过期，则返回 403 禁止访问
        }
        req.user = user;  // 将解码的用户信息添加到请求对象
        next();  // 调用下一个中间件或路由处理器
    });
}

// 注册新用户
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "用户已存在" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        const token = jwt.sign(
            { email: newUser.email, id: newUser._id },
            'your_secret_key',
            { expiresIn: '1h' }
        );

        res.status(201).json({ result: newUser, token });
    } catch (error) {
        res.status(500).json({ message: "注册时出现错误" });
    }
});

// 用户登录
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "用户不存在" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "无效的凭据" });
        }

        const token = jwt.sign(
            { email: existingUser.email, id: existingUser._id },
            'your_secret_key',
            { expiresIn: '1h' }
        );

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: "登录时出现错误" });
    }
});

// 获取用户信息
router.get('/user/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); // 不返回密码字段
        if (!user) {
            return res.status(404).json({ message: "用户未找到" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "获取用户信息时出现错误" });
    }
});

module.exports = router;
