import ora from "ora";
class Spinner {
  constructor() {
    this.spinner = ora();
  }
  start(msg) {
    this.spinner.text = msg;
    this.spinner.start();
  }
  succeed(msg) {
    this.spinner.succeed(msg);
  }
}

export default new Spinner();
