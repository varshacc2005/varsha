import { Star, MapPin, Languages, Briefcase, ChevronRight } from 'lucide-react';
import GlassCard from './GlassCard';

const CounselorCard = ({ counselor, onSelect, isSelected }) => {
    return (
        <div onClick={() => onSelect(counselor)} className="cursor-pointer group">
            <GlassCard
                className={`transition-all duration-300 ${isSelected ? 'ring-2 ring-indigo-500 shadow-indigo-500/20 transform scale-[1.02]' : 'hover:shadow-indigo-500/10'}`}
                hoverEffect={!isSelected}
            >
                <div className="p-5 flex gap-4 items-center">
                    <img
                        src={counselor.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                        alt={counselor.name}
                        className="w-20 h-20 rounded-2xl object-cover bg-gray-100 shadow-sm group-hover:shadow-md transition-shadow"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{counselor.name}</h3>
                                <p className="text-indigo-500 font-medium text-sm">{counselor.specialization}</p>
                            </div>
                            <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-lg border border-yellow-400/20">
                                <Star className="text-yellow-500 w-3 h-3 fill-yellow-500" />
                                <span className="text-xs font-bold text-yellow-700">4.9</span>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                            {counselor.experience > 0 && (
                                <div className="flex items-center gap-1.5">
                                    <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                                    <span>{counselor.experience} Years Exp.</span>
                                </div>
                            )}
                            {counselor.languages && counselor.languages.length > 0 && (
                                <div className="flex items-center gap-1.5">
                                    <Languages className="w-3.5 h-3.5 text-purple-400" />
                                    <span>{counselor.languages[0]}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center pl-4 border-l border-gray-100/50">
                        <div className={`p-2 rounded-full transition-colors ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                            <ChevronRight className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default CounselorCard;
