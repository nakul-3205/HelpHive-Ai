import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { inngest } from '../inngest/client.js';
import User from '../models/User.js';

export const signup = async (req, res) => {
  const { email, password, skills = [] } = req.body;

  try {
    if (!email || !password)
      return res.status(400).json({ error: 'Email & password required' });

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPass,
      skills,
    });

    await inngest.sendEvent({
      name: 'user/signup',
      data: { email: newUser.email },
    });

    const token = jwt.sign(
      { _id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({ user, token });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = (_req, res) =>
  res.json({ message: 'Logged out successfully (client‑side token removed)' });

export const updateUser = async (req, res) => {
  const { skills = [], role, email } = req.body;

  try {
    if (!req.user || req.user.role !== 'admin')
      return res.status(403).json({ error: 'Forbidden: admin only' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    await User.updateOne(
      { email },
      {
        $set: {
          skills: skills.length ? skills : user.skills,
          role,
        },
      }
    );

    return res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error during user update:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUser = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin')
      return res.status(403).json({ error: 'Forbidden: admin only' });

    const users = await User.find().select('-password');
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
