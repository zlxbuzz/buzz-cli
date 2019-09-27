import logger from "./logger";
export default error => {
  logger.error(error.stack);
  process.exit(1);
};
