import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  return await response.json();
}

export default function HealthPage() {
  return (
    <>
      <h1>Status page</h1>
      <DatabaseInfo />
    </>
  );
}

function DatabaseInfo() {
  const { isLoading, data } = useSWR("/api/v1/health", fetchAPI, {
    refreshInterval: 2000,
  });

  let dbStatusInfo;

  if (isLoading) {
    dbStatusInfo = "Carregando...";
  }

  if (!isLoading && data) {
    dbStatusInfo = (
      <>
        <p>Última atualização: {data.updated_at}</p>
        <p>Conexões disponíveis: {data.dependencies.database.maxConnections}</p>
        <p>Conexões abertas: {data.dependencies.database.openedConnections}</p>
        <p>Versão do banco de dados: {data.dependencies.database.version}</p>
      </>
    );
  }

  return <div>{dbStatusInfo}</div>;
}
