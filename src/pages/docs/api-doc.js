"use client";

import "swagger-ui-react/swagger-ui.css";
import SwaggerUI from "swagger-ui-react";

function ReactSwagger({ url }) {
  return <SwaggerUI url={url} />;
}

export default ReactSwagger;
