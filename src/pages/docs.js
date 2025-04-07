import { createSwaggerSpec } from "next-swagger-doc";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import InternalServerError from "components/schemas/HttpError";
import HttpSuccess from "components/schemas/HttpSuccess";
import { ListOfMonths, Month, MonthCreate } from "components/schemas/month";
import { ListOfYears, Year } from "components/schemas/year";
import { Salary, SalaryCreate } from "components/schemas/salary";
import {
  Bank,
  BankCreate,
  BankUpdate,
  ListOfBanks,
} from "components/schemas/bank";
import {
  BankStatement,
  ListOfBankStatements,
} from "components/schemas/bankStatement";
import { YearMonth } from "components/schemas/yearMonth";
import {
  ExtraIncome,
  ExtraIncomeCreate,
  ListOfExtraIncome,
} from "components/schemas/extraIncome";

const SwaggerUI = dynamic(import("swagger-ui-react"), { ssr: false });

export default function ApiDoc({ spec }) {
  return <SwaggerUI spec={spec} />;
}

export async function getStaticProps() {
  const spec = createSwaggerSpec({
    apiFolder: "src/pages/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Financial Manager API ",
        version: "1.0",
        description:
          "Documentation of routes available in financial-manager application",
        contact: "enricovmarquezz@gmail.com",
      },
      components: {
        schemas: {
          HttpSuccess,
          Year,
          ListOfYears,
          InternalServerError,
          Month,
          ListOfMonths,
          MonthCreate,
          Salary,
          SalaryCreate,
          Bank,
          BankCreate,
          BankUpdate,
          ListOfBanks,
          BankStatement,
          ListOfBankStatements,
          YearMonth,
          ExtraIncome,
          ListOfExtraIncome,
          ExtraIncomeCreate,
        },
      },
      tags: [
        {
          name: "Year",
          description: "Manage year resource",
        },
        {
          name: "Month",
          description: "Manage month resource",
        },
        {
          name: "Salary",
          description: "Manage salary resource",
        },
        {
          name: "Bank",
          description: "Manage bank resource",
        },
        {
          name: "Bank Statement",
          description: "Manage your expenses, debits and gains over the months",
        },
        {
          name: "Extra Income",
          description: "Add extra earnings to make up your salary",
        },
      ],
    },
  });

  return {
    props: {
      spec,
    },
  };
}
