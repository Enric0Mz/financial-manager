import React from "react";
import ReactSwagger from "./api-doc";

const page = () => {
  return (
    <div>
      <ReactSwagger url="/lib/swagger.json" />
    </div>
  );
};

export default page;
