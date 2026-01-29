import ErrorPage from "./ErrorPage";

const ForbiddenPage: React.FC = () => (
  <ErrorPage
    errorCode="403"
    title="Restricted Access"
    description=""
  />
);

export default ForbiddenPage;
