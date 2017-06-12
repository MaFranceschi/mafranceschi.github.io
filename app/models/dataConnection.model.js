function DataConnection(name, dataConnection, fileConnection)
{
    this.user = name;
    this.receiveMessages = 0;
    this.dataConnection = dataConnection;
    this.fileConnection = fileConnection;
    this.messages = [];
}

DataConnection.prototype.isDataConnectionActive = function()
{
    var result = false;

    if(typeof this.dataConnection != undefined && typeof dataConnection != null)
    {
        if(this.dataConnection.open)
            result = true;
    }

    return result;
}

DataConnection.prototype.isFileConnectionActive = function()
{
    var result = false;

    if(typeof this.fileConnection != undefined && typeof fileConnection != null)
    {
        if(this.fileConnection.open)
            result = true;
    }

    return result;
}

DataConnection.prototype.existsConnection = function(connections, peerId)
{
    var result = false;

    if(typeof connections != null && typeof connections != undefined)
    {
        if(peerId in connections)
            result = true;
    }

    return result;
}

DataConnection.prototype.addMessage = function(message)
{
    this.messages.push(message);
}

DataConnection.prototype.addFile = function(file)
{
    this.messages.push(file);
}

DataConnection.prototype.sendMessage = function(data)
{

    var date = new Date();
    var formattedDate = date.formattedDate(date);
    var message = new Message(data, this.user, formattedDate, 'text');


    this.dataConnection.send(message.toJSON());

    return message;

}

DataConnection.prototype.sendFile = function(file)
{
    var date = new Date();
    var formattedDate = date.formattedDate(date);

    var message = new Message(file, this.user, formattedDate, 'file');

    this.fileConnection.send(message.toJSON());

    return message;
}

DataConnection.prototype.close = function()
{
    this.user = '';
    this.receiveMessages = 0;
    this.dataConnection.close();
    this.fileConnection.close();
    this.messages = [];   
}