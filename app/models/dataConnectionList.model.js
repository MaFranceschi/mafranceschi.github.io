function DataConnectionList()
{

}


/**
 * @description: Agrega una nueva conexion identificada por el peerId del beneficiario
 * @param {String} peerId identificador del usuario
 * @param {DataChannel} dataConnection conexion de datos a ser inicializada
 */
DataConnectionList.prototype.addDataConnection = function(peerId, dataConnection, username)
{
    if(!(peerId in this))
    {
        this[peerId] = new DataConnection(username, dataConnection, null);
    }
    else
        this[peerId].dataConnection = dataConnection;
}


DataConnectionList.prototype.addFileConnection = function(peerId, fileConnection, username)
{
    if(!peerId in this)
    {
        this[peerId] = new DataConnection(username, null, fileConnection);
    }
    else
        this[peerId].fileConnection = fileConnection;
}


/**
 * @description: Elimina una nueva conexion identificada por el peerId del beneficiario
 */
DataConnectionList.prototype.removeConnection = function(peerId)
{
    if(peerId in this)
        delete this[peerId];
}
