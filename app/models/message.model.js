function Message(content, sentBy, when, type)
{
    this.when = when;
    this.content = content;
    this.sentBy = sentBy; 
    this.type = type;
}

Message.prototype.toJSON = function()
{
    var message = 
    {
        when: this.when,
        content: this.content,
        sentBy: this.sentBy,
        type: this.type 
    }

    return JSON.stringify(message);
}
