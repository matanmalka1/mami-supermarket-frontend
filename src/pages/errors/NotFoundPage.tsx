import ErrorPage from "./ErrorPage";

const NotFoundPage: React.FC = () => (
  <ErrorPage
    errorCode="404"
    title="Page not found"
    description="We can't locate the page you requested. Try browsing the store or search for what you are looking for."
  />
);
export default NotFoundPage;
