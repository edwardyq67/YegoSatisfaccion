import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { FaUserAlt } from "react-icons/fa";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import logo from './img/yego.png';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const {
        register,
        handleSubmit
    } = useForm();

    const togglePassword = () => {
        setShowPassword(prevState => !prevState);
    };

    const onSubmit = async (data) => {
        try {
            const response = await axios.post("http://161.132.204.206:3001/login", {
                usuario: data.usuario,
                contraseña: data.contraseña
            });
    
            if (response.status === 200) {
                const responseData = response.data;
                const validUsers = ['cortegam', 'amontoyar','eyllanesq'];
    
                // Verificar si el usuario coincide con alguno de los valores permitidos
                if (validUsers.includes(responseData.user)) {
                    // Guardar el token en localStorage
                    localStorage.setItem('token', responseData.user);
    
                    // Redireccionar al Dashboard
                    navigate('/Satisfaccion');  // Usando react-router-dom
                } else {
                    setErrorMessage('Usuario no autorizado.');
                }
            } else {
                setErrorMessage('Credenciales incorrectas, intenta de nuevo.');
            }
        } catch (error) {
            console.error('Error al conectar con el servidor', error);
            setErrorMessage('Error al iniciar sesión. Verifica tu conexión o credenciales.');
        }
    };

    return (
        <div className='Login_relative flex justify-end items-center pr-10'>
            <form 
                action="" 
                onSubmit={handleSubmit(onSubmit)} 
                className="bg-white/60 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-md mx-4"
            >
                <img className="w-60 mx-auto mb-6" src={logo} alt="Logo" />

                <h2 className="text-2xl font-bold text-center mb-4">Iniciar Sesión</h2>
                <p className="text-gray-600 text-center mb-6">Por favor, ingresa tu usuario y contraseña</p>

                {/* Input de Usuario */}
                <div className="flex items-center bg-gray-100 shadow-md rounded-md p-3 mb-4 gap-4">
                    <FaUserAlt size={20} className="text-gray-500" />
                    <input
                        type="text"
                        placeholder="Usuario"
                        {...register("usuario", { required: "Este campo es obligatorio" })}
                        className="w-full bg-transparent focus:outline-none"
                    />
                </div>

                {/* Input de Contraseña */}
                <div className="flex items-center bg-gray-100 shadow-md rounded-md p-3 mb-4 gap-4">
                    <button
                        type="button"
                        onClick={togglePassword}
                        className="focus:outline-none"
                    >
                        {showPassword ? <IoEyeOffSharp size={20} className="text-gray-500" /> : <IoEyeSharp size={20} className="text-gray-500" />}
                    </button>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Contraseña"
                        {...register("contraseña", { required: "La contraseña es obligatoria" })}
                        className="w-full bg-transparent focus:outline-none"
                    />
                </div>

                {/* Mensaje de Error */}
                {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}

                {/* Botón de envío */}
                <button
                    type="submit"
                    className="w-full bg-red-600 text-white font-bold py-2 rounded-md mt-4 hover:bg-red-700 transition-all"
                >
                    Ingresar
                </button>
            </form>
        </div>
    );
}

export default Login;
