import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  return await response.json();
}

export default function HealthPage() {
  return (
    <div className="min-h-screen bg-primaryDark flex flex-col items-center justify-center py-10">
      <h1 className="text-4xl font-bold text-highlight mb-8">Status Page</h1>
      <DatabaseInfo />
    </div>
  );
}

function DatabaseInfo() {
  const { isLoading, data } = useSWR("/api/v1/health", fetchAPI, {
    refreshInterval: 2000,
  });

  let dbStatusInfo;

  if (isLoading) {
    dbStatusInfo = (
      <div className="bg-secondary p-4 rounded-lg shadow-lg text-highlight">
        Carregando...
      </div>
    );
  }

  if (!isLoading && data) {
    dbStatusInfo = (
      <div className="bg-primary p-6 border border-accent shadow-lg rounded-lg space-y-4">
        <h1 className="text-2xl font-semibold text-highlight mb-4 border-b border-accent pb-2">
          Database Status
        </h1>

        <p className="text-highlight">
          <span className="font-bold">Última atualização:</span>{" "}
          {data.updated_at}
        </p>
        <div className="border-t border-accent my-2"></div>
        <p className="text-highlight">
          <span className="font-bold">Conexões disponíveis:</span>{" "}
          {data.dependencies.database.maxConnections}
        </p>
        <p className="text-highlight">
          <span className="font-bold">Conexões abertas:</span>{" "}
          {data.dependencies.database.openedConnections}
        </p>
        <p className="text-highlight">
          <span className="font-bold">Versão do banco de dados:</span>{" "}
          {data.dependencies.database.version}
        </p>
      </div>
    );
  }

  return <div className="w-full max-w-md mx-auto">{dbStatusInfo}</div>;
}
