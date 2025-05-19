import { createContainer, asClass } from "awilix";
import path from "path";
import lodash from "lodash";

export type AppContainer = {};

const container = createContainer();

const distDir = path.join(__dirname, "../../");

container.loadModules(
  [
    path.join(distDir, "controllers/**/*.js"),
    path.join(distDir, "usecases/**/**/*.js"),
    path.join(distDir, "infra/database/repositories/*.js"),
    path.join(distDir, "shared/services/**/*.js"),
  ],
  {
    formatName: (name: string) => {
      name = lodash.camelCase(name);

      return name;
    },
    resolverOptions: {
      lifetime: "SINGLETON",
      register: asClass,
    },
  },
);

export { container };
