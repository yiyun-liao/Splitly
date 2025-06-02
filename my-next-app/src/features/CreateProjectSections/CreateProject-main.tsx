import ProjectForm from "@/features/CreateProjectSections/ProjectForm";
import { UserData } from "@/types/user";

interface CreatePaymentProps {
    onClose: () => void;
    open?: boolean;
    userData: UserData;
}

export default function CreateProject({
  open = true,
  onClose,
  userData
}: CreatePaymentProps) {
  return (
    <ProjectForm
        open={open}
        onClose={onClose}
        userData={userData}
        sheetTitle="新增專案"
    />
  );
}