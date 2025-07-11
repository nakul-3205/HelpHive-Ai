import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { inngest } from '../inngest/client.js';
import User from '../models/User.js';

export const signup = async (req,res) => {
        const {email,password,skills=[]}=req.body;
        try {
           const hashedPass= bcrypt.hash(password, 10)
           const user=await user.create({
                email,
                password: hashedPass,
                skills
           })
              //fire ingest event 
              await inngest.sendEvent({
                name: 'user/signup',
                data: {
                    email: user.email,
                }})
               const token= jwt.sign(
                    {_id: user._id, role: user.role},
                    process.env.JWT_SECRET,
                )
                res.status(201).json({user,token})
            
        } catch (error) {
            console.error('Error during signup:', error);
            return res.status(500).json({ error: 'Internal server error' });
            
        }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
       const user= User.findOne({ email })
       if(!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const token = jwt.sign(
                { _id: user._id, role: user.role },
                process.env.JWT_SECRET,
            );
            res.status(200).json({ user, token });
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Internal server error' });
        
    }
}

export const logout = async (req, res) => {
    try {
        const token=req.headers.authorization.split(' ')[1] 
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err,decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid token' });
            }
            res.json({ message: 'Logged out successfully' });
        })
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ error: 'Internal server error' });
        
    }
}

export const updateUser=async (req, res) => {
    const {skills=[],role,email}=req.body;
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if(req.user.role !== 'admin' ) {
            return res.status(403).json({ error: 'Forbidden: Only admins can change roles' });
        }
        const user=await User.findOne({email})
        if(!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const updatedUser=await User.UpdateOne(
            {email},
            {
            
                    skills:skills.length? skills : user.skills,
                    role
                
            },
                   )
                   return res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error during user update:', error);
        return res.status(500).json({ error: 'Internal server error' });
        
    }
}

export const getUser = async (req, res) => {
    try {
        if(req.user.role !== 'admin' ) {
            return res.status(403).json({ error: 'Forbidden: Only admins can view users' });
        }
        const user=await User.find().select('-password');
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error during fetching user:', error);
        return res.status(500).json({ error: 'Internal server error' });
        
    }
}