const UserModel = require('../models/userModel'); 
const bcrypt = require('bcrypt');
const { sendEvent } = require('../config/queue');
const saltRounds = 10; 
 
const UserController = { 
    registerUser: async (req, res) => { 
        const { username, password, role } = req.body; 
        if (!username || !password) { 
            return res.status(400).json({ message: 'Username and password are required' }); 
        } 
        try { 
            const existingUser = await UserModel.findByUsername(username);
            if (existingUser) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const userId = await UserModel.create(username, hashedPassword, role || 'customer'); 
            
            await sendEvent('user_queue', {
                event: 'user_registered',
                userId,
                username,
                role: role || 'customer',
                timestamp: new Date()
            });
            
            res.status(201).json({ message: 'User registered successfully', userId }); 
        } catch (error) { 
            console.error('Error registering user:', error); 
            res.status(500).json({ message: 'Error registering user' }); 
        } 
    }, 
 
    loginUser: async (req, res) => { 
        const { username, password } = req.body; 
        if (!username || !password) { 
            return res.status(400).json({ message: 'Username and password are required' }); 
        } 
        try { 
            const user = await UserModel.findByUsername(username); 
            if (!user) { 
                return res.status(401).json({ message: 'Invalid credentials' }); 
            } 
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) { 
                return res.status(401).json({ message: 'Invalid credentials' }); 
            } 
            
            await sendEvent('user_queue', {
                event: 'user_login',
                userId: user.id,
                username: user.username,
                timestamp: new Date()
            });
            
            res.status(200).json({ 
                message: 'Login successful', 
                user: { id: user.id, username: user.username, role: user.role } 
            }); 
        } catch (error) { 
            console.error('Error logging in user:', error); 
            res.status(500).json({ message: 'Error logging in user' }); 
        } 
    }, 
 
    getUserById: async (req, res) => { 
        const { id } = req.params; 
        try { 
            const user = await UserModel.findById(id); 
            if (!user) { 
                return res.status(404).json({ message: 'User not found' }); 
            } 
            const { password, ...userWithoutPassword } = user;
            res.status(200).json(userWithoutPassword); 
        } catch (error) { 
            console.error('Error getting user by ID:', error); 
            res.status(500).json({ message: 'Error getting user' }); 
        } 
    }, 
 
    updateUser: async (req, res) => { 
        const { id } = req.params; 
        const { username, password, role } = req.body; 
        try { 
            const user = await UserModel.findById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            let hashedPassword = user.password;
            if (password) {
                hashedPassword = await bcrypt.hash(password, saltRounds);
            }

            const updatedUsername = username || user.username;
            const updatedRole = role || user.role;

            const affectedRows = await UserModel.update(id, updatedUsername, hashedPassword, updatedRole); 
            if (affectedRows === 0) { 
                return res.status(400).json({ message: 'No changes made' }); 
            } 
            
            await sendEvent('user_queue', {
                event: 'user_updated',
                userId: id,
                username: updatedUsername,
                timestamp: new Date()
            });
            
            res.status(200).json({ message: 'User updated successfully' }); 
        } catch (error) { 
            console.error('Error updating user:', error); 
            res.status(500).json({ message: 'Error updating user' }); 
        } 
    }, 
 
    deleteUser: async (req, res) => { 
        const { id } = req.params; 
        try { 
            const affectedRows = await UserModel.delete(id); 
            if (affectedRows === 0) { 
                return res.status(404).json({ message: 'User not found' }); 
            } 
            
            await sendEvent('user_queue', {
                event: 'user_deleted',
                userId: id,
                timestamp: new Date()
            });
            
            res.status(200).json({ message: 'User deleted successfully' }); 
        } catch (error) { 
            console.error('Error deleting user:', error); 
            res.status(500).json({ message: 'Error deleting user' }); 
        } 
    }, 
 
    getAllUsers: async (req, res) => { 
        try { 
            const users = await UserModel.getAll(); 
            const safeUsers = users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
            res.status(200).json(safeUsers); 
        } catch (error) { 
            console.error('Error getting all users:', error); 
            res.status(500).json({ message: 'Error getting all users' }); 
        } 
    } 
}; 

module.exports = UserController;