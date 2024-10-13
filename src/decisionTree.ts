abstract class ActionNode {
  abstract execute(): void;
  abstract toJSON(): any;
}

class SendSMS extends ActionNode {
  constructor(private phoneNumber: string) {
    super();
  }

  execute() { 
    console.log(`Sending SMS to ${this.phoneNumber}`);
  }

  toJSON() {
    return { type: "SendSMS", phoneNumber: this.phoneNumber };
  }

  static fromJSON(data: any): SendSMS {
    return new SendSMS(data.phoneNumber);
  }
}

class SendEmail extends ActionNode {
  constructor(private sender: string, private receiver: string) {
    super();
  }

  execute() {
    console.log(`Sending Email from ${this.sender} to ${this.receiver}`);
  }

  toJSON() {
    return { type: "SendEmail", sender: this.sender, receiver: this.receiver };
  }

  static fromJSON(data: any): SendEmail {
    return new SendEmail(data.sender, data.receiver);
  }
}

class Condition extends ActionNode {
  constructor(
    private expression: string,
    private trueAction: ActionNode,
    private falseAction: ActionNode
  ) {
    super();
  }

  execute() {
    const result = eval(this.expression);
    if (result) {
      this.trueAction.execute();
    } else {
      this.falseAction.execute();
    }
  }

  toJSON() {
    return {
      type: "Condition",
      expression: this.expression,
      trueAction: this.trueAction.toJSON(),
      falseAction: this.falseAction.toJSON(),
    };
  }

  static fromJSON(data: any): Condition {
    return new Condition(
      data.expression,
      deserializeNode(data.trueAction),
      deserializeNode(data.falseAction)
    );
  }
}

class Loop extends ActionNode {
  constructor(private iterations: number, private subtree: ActionNode) {
    super();
  }

  execute() {
    for (let i = 0; i < this.iterations; i++) {
      this.subtree.execute();
    }
  }

  toJSON() {
    return {
      type: "Loop",
      iterations: this.iterations,
      subtree: this.subtree.toJSON(),
    };
  }

  static fromJSON(data: any): Loop {
    return new Loop(data.iterations, deserializeNode(data.subtree));
  }
}

function deserializeNode(data: any): ActionNode {
  switch (data.type) {
    case "SendSMS":
      return SendSMS.fromJSON(data);
    case "SendEmail":
      return SendEmail.fromJSON(data);
    case "Condition":
      return Condition.fromJSON(data);
    case "Loop":
      return Loop.fromJSON(data);
    default:
      throw new Error("Unknown node type");
  }
}

function processDecisionTree(treeJSON: string) {
  const rootNode = deserializeNode(JSON.parse(treeJSON));
  rootNode.execute();
}

const tree = new Condition(
  "new Date().getFullYear() === 2025",
  new SendSMS("123456789"),
  new SendEmail("sender@example.com", "receiver@example.com")
);

const treeJSON = JSON.stringify(tree.toJSON());
console.log("Serialized Tree:", treeJSON);

processDecisionTree(treeJSON);
