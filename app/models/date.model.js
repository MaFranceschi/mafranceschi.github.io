Date.prototype.formattedDate = (date)=>
{
    const formattedDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' '
                    + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

    return formattedDate;
}