import { Card, Divider } from "@mantine/core";
import { CiWarning } from "react-icons/ci";
import useAuth from "../../../../hooks/useAuth/useAuth";
import { getSkillIcon } from "../../../../utils/common";
import type { Skill } from "../../../../types/common.type";

const Skills = () => {
  const { user } = useAuth();

  return (
    <div className="grid 600:grid-cols-2 items-start gap-6">
      <Card className="card transition-all duration-300">
        <div className="text-h2 font-bold mb-1" style={{ color: '#6366F1' }}>
          Skills Offered
        </div>
        <Divider className="my-4" style={{ borderColor: '#E2E8F0' }} />
        <div className="space-y-2">
          {user?.teachSkills.length === 0 ? (
            <div className="text-sm flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#475569' }}>
              <div>
                <CiWarning color="#F59E0B" size={18} />
              </div>
              <div>
                Please add skills you can teach in Profile page
              </div>
            </div>
          ) : (
            user?.teachSkills?.map((ele, index) => (
              <div key={index} className="flex items-center text-md gap-3 py-2 px-3 rounded-lg transition-colors duration-200" style={{ color: '#0F172A' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                {getSkillIcon(ele as Skill)}
                <span className="font-medium">{ele}</span>
              </div>
            ))
          )}
        </div>
      </Card>
      <Card className="card transition-all duration-300">
        <div className="text-h2 font-bold mb-1" style={{ color: '#14B8A6' }}>
          Skills Wanted
        </div>
        <Divider className="my-4" style={{ borderColor: '#E2E8F0' }} />
        <div className="space-y-2">
          {user?.learnSkills.length === 0 ? (
            <div className="text-sm flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#475569' }}>
              <div>
                <CiWarning color="#F59E0B" size={18} />
              </div>
              <div>
                Please add skills you want to learn in Profile page
              </div>
            </div>
          ) : (
            user?.learnSkills?.map((ele, index) => (
              <div key={index} className="flex items-center text-md gap-3 py-2 px-3 rounded-lg transition-colors duration-200" style={{ color: '#0F172A' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(20, 184, 166, 0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                {getSkillIcon(ele as Skill)}
                <span className="font-medium">{ele}</span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default Skills;
