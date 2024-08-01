
import "../App.css";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormErrMsg = ({ errors, inputName }:any) => {
  return <span className="errorMessage">{errors[inputName]?.message}</span>;
};

export default FormErrMsg;
