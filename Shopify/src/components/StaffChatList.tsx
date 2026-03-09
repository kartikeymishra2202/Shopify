import  { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface ChatUser {
  id: number;
  name: string;
}

const StaffChatList = () => {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users who have messaged support
    api.get('active-chats/').then(res => setUsers(res.data));
  }, []);

  return (
    <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200">
      <h3 className="font-black text-slate-800 mb-4 uppercase text-xs tracking-widest">Active Conversations</h3>
      <div className="space-y-2">
        {users.length > 0 ? users.map(user => (
          <button
            key={user.id}
            onClick={() => navigate(`/chat/${user.id}`)}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all group"
          >
            <span className="font-bold text-slate-700">{user.name}</span>
            <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-1 rounded-md font-black">OPEN</span>
          </button>
        )) : (
          <p className="text-sm text-slate-400">No active messages.</p>
        )}
      </div>
    </div>
  );
};

export default StaffChatList;