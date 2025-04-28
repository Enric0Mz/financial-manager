import { createSwaggerSpec } from "next-swagger-doc";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import InternalServerError from "components/schemas/HttpError";
import HttpSuccess from "components/schemas/HttpSuccess";
import { ListOfMonths, Month, MonthCreate } from "components/schemas/Month";
import { ListOfYears, Year } from "components/schemas/Year";
import { Salary, SalaryCreate } from "components/schemas/Salary";
import {
  Bank,
  BankCreate,
  BankUpdate,
  ListOfBanks,
} from "components/schemas/Bank";
import {
  BankStatement,
  ListOfBankStatements,
} from "components/schemas/BankStatement";
import { YearMonth } from "components/schemas/YearMonth";
import {
  ExtraIncome,
  ExtraIncomeCreate,
  ListOfExtraIncome,
} from "components/schemas/ExtraIncome";
import {
  Expense,
  CreditExpenseCreate,
  ExpenseUpdate,
  DebitExpenseCreate,
} from "components/schemas/Expense";
import {
  User,
  UserCreate,
  UserLogin,
  UserUpdate,
} from "components/schemas/User";
import { RefreshToken } from "components/schemas/Auth";
import { Health } from "components/schemas/Health";

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
          Expense,
          CreditExpenseCreate,
          ExpenseUpdate,
          DebitExpenseCreate,
          User,
          UserCreate,
          UserUpdate,
          UserLogin,
          RefreshToken,
          Health,
        },
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          BearerAuth: [],
        },
      ],
      tags: [
        {
          name: "Health",
          description: "Health routes",
        },
        {
          name: "Calendar",
          description: "Create calendar of the application",
        },
        {
          name: "User",
          description: "Manage your user",
        },
        {
          name: "Auth",
          description: "Authentication and authorization",
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
          description: "Manage extra earnings to make up your salary",
        },
        {
          name: "Expense - Credit",
          description: "Manage your credit expenses",
        },
        {
          name: "Expense - Debit",
          description: "Manage your debit expenses",
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
