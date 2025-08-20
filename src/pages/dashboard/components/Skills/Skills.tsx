import { Card, Divider } from "@mantine/core";
import { CiWarning } from "react-icons/ci";
import useAuth from "../../../../hooks/useAuth/useAuth";
import { getSkillIcon } from "../../../../utils/common";
import type { Skill } from "../../../../types/common.type";

const Skills = () => {
  const { user } = useAuth();

  return (
    <div className="grid 600:grid-cols-2 items-start gap-5">
      <Card>
        <div>Skills Offered</div>
        <Divider className="my-3" />
        <div>
          {user?.teachSkills.length === 0 ? (
            <div className="text-gray-500 text-sm flex items-center gap-3">
              <div>
                <CiWarning color="red" size={16} />
              </div>
              <div className="mt-0.5">
                Please add skills you can teach in Profile page
              </div>
            </div>
          ) : (
            user?.teachSkills?.map((ele, index) => (
              <div key={index} className="flex items-center text-md gap-3 py-1">
                {getSkillIcon(ele as Skill)}
                {ele}
              </div>
            ))
          )}
        </div>
      </Card>
      <Card>
        <div>Skills Wanted</div>
        <Divider className="my-3" />
        <div>
          {user?.learnSkills.length === 0 ? (
            <div className="text-gray-500 text-sm flex items-center gap-3">
              <div>
                <CiWarning color="red" size={16} />
              </div>
              <div className="mt-0.5">
                Please add skills you want to learn in Profile page
              </div>
            </div>
          ) : (
            user?.learnSkills?.map((ele, index) => (
              <div key={index} className="flex items-center text-md gap-3 py-1">
                {getSkillIcon(ele as Skill)}
                {ele}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default Skills;
