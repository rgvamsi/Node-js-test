exports.buildSearchQuery=(searchBy, searchFields)=>{
    let query=''
    let params=[]
    if (searchBy && searchFields.length>0){
        const conditions=searchFields.map(field=>`${field} LIKE ?`).join('OR')
        query=`AND (${conditions})`
        params=searchFields.map(()=>`%${searchBy}`)
    }
    return {query, params}
}