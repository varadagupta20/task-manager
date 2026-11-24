import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
 
const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
 
export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
 
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({
    resolver: zodResolver(schema)
  });
 
  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/register', data);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError('root', { message: err.response?.data?.error || 'Registration failed' });
    }
  };
 
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-sm border w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create your account</h1>
 
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {["name","email","password"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
              <input {...register(field)}
                type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field].message}</p>}
            </div>
          ))}
 
          {errors.root && (
            <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{errors.root.message}</p>
          )}
 
          <button type="submit" disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>
 
        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account? <Link to="/login" className="text-blue-600 font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}
