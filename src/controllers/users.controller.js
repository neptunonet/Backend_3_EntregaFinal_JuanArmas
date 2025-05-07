import { usersService } from "../services/index.js"

const getAllUsers = async(req,res)=>{
    const users = await usersService.getAll();
    res.send({status:"success",payload:users})
}

const getUser = async(req,res)=> {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error",error:"User not found"})
    res.send({status:"success",payload:user})
}

const updateUser =async(req,res)=>{
    const updateBody = req.body;
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error", error:"User not found"})
    const result = await usersService.update(userId,updateBody);
    res.send({status:"success",message:"User updated"})
}

const deleteUser = async(req,res) =>{
    const userId = req.params.uid;
    const result = await usersService.getUserById(userId);
    res.send({status:"success",message:"User deleted"})
}

const createUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        // Validación de campos requeridos
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({ status: "error", error: "Todos los campos son requeridos" });
        }

        // Verificar si el usuario ya existe
        const existingUser = await usersService.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ status: "error", error: "El usuario ya existe" });
        }

        // Crear hash de la contraseña
        const hashedPassword = await createHash(password);

        // Crear el nuevo usuario
        const newUser = {
            first_name,
            last_name,
            email,
            password: hashedPassword,
            role: 'user' 
        };

        const result = await usersService.create(newUser);

        res.status(201).json({ 
            status: "success", 
            message: "Usuario creado exitosamente", 
            payload: { id: result._id, email: result.email } 
        });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ status: "error", error: "Error interno del servidor" });
    }
};



export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
    createUser
}