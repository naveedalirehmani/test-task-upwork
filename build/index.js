"use strict";
// Base ActionNode Class
class ActionNode {
}
// SendSMS Node
class SendSMS extends ActionNode {
    constructor(phoneNumber) {
        super();
        this.phoneNumber = phoneNumber;
    }
    execute() {
        console.log(`Sending SMS to ${this.phoneNumber}`);
    }
    toJSON() {
        return { type: 'SendSMS', phoneNumber: this.phoneNumber };
    }
    static fromJSON(data) {
        return new SendSMS(data.phoneNumber);
    }
}
// SendEmail Node
class SendEmail extends ActionNode {
    constructor(sender, receiver) {
        super();
        this.sender = sender;
        this.receiver = receiver;
    }
    execute() {
        console.log(`Sending Email from ${this.sender} to ${this.receiver}`);
    }
    toJSON() {
        return { type: 'SendEmail', sender: this.sender, receiver: this.receiver };
    }
    static fromJSON(data) {
        return new SendEmail(data.sender, data.receiver);
    }
}
// Condition Node
class Condition extends ActionNode {
    constructor(expression, trueAction, falseAction) {
        super();
        this.expression = expression;
        this.trueAction = trueAction;
        this.falseAction = falseAction;
    }
    execute() {
        const result = eval(this.expression);
        if (result) {
            this.trueAction.execute();
        }
        else {
            this.falseAction.execute();
        }
    }
    toJSON() {
        return {
            type: 'Condition',
            expression: this.expression,
            trueAction: this.trueAction.toJSON(),
            falseAction: this.falseAction.toJSON()
        };
    }
    static fromJSON(data) {
        return new Condition(data.expression, deserializeNode(data.trueAction), deserializeNode(data.falseAction));
    }
}
// Loop Node
class Loop extends ActionNode {
    constructor(iterations, subtree) {
        super();
        this.iterations = iterations;
        this.subtree = subtree;
    }
    execute() {
        for (let i = 0; i < this.iterations; i++) {
            this.subtree.execute();
        }
    }
    toJSON() {
        return {
            type: 'Loop',
            iterations: this.iterations,
            subtree: this.subtree.toJSON()
        };
    }
    static fromJSON(data) {
        return new Loop(data.iterations, deserializeNode(data.subtree));
    }
}
// Deserialize function to rebuild the tree from JSON
function deserializeNode(data) {
    switch (data.type) {
        case 'SendSMS':
            return SendSMS.fromJSON(data);
        case 'SendEmail':
            return SendEmail.fromJSON(data);
        case 'Condition':
            return Condition.fromJSON(data);
        case 'Loop':
            return Loop.fromJSON(data);
        default:
            throw new Error('Unknown node type');
    }
}
// Backend service function
function processDecisionTree(treeJSON) {
    const rootNode = deserializeNode(JSON.parse(treeJSON));
    rootNode.execute();
}
// Example tree creation and serialization
const tree = new Condition("new Date().getFullYear() === 2025", new SendSMS("123456789"), new SendEmail("sender@example.com", "receiver@example.com"));
// Serialize tree to JSON
const treeJSON = JSON.stringify(tree.toJSON());
console.log("Serialized Tree:", treeJSON);
// Process tree from JSON
processDecisionTree(treeJSON);
