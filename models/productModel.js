const pool=require('../config/dbConfig')
const {buildSearchQuery}=require('../helper/paginationHelper')
exports.getProducts=async(currentPage,pageSize,orderBy,orderDir,searchBy,searchFields)=>{
    const offset=(currentPage-1)*pageSize
    const order=orderDir.toUpperCase()==='ASC' ? 'ASC':'DESC'
    let searchQuery=''
    let queryParams=[]
    if (searchBy && searchFields.length>0){
        const {query, params}=buildSearchQuery(searchBy, searchFields)
        searchQuery=query
        queryParams=params
    }
    const totalCountQuery=`SELECT COUNT(*) as totalCount FROM ProductV2 WHERE 1=1 ${searchQuery}`
    const productsQuery=`SELECT 
    productId,
     productName,
     productImageName,
     productImageURL,
     brandName,
     description,
     itemCode,
     itemType,
     currency,
     currencyCode,
     saleAmount,
     brochureFileName,
     brochureFileURL,
     vendors,
     status,
     createdBy,
     created,
     updated,
     subCategoryId,
     categoryId,
     uomId,
     shippingMethodId,
     shippingTermsId,
     paymentTermsId,
     categoryName,
     subCategoryName,
     uomCode,
     uomDescription,
     organisationName,
     organisationId,
     vendorInfo
    FROM VendorsOrganizations WHERE VendorsOrganizationId=ProductV2.vendorId AS vendorInfo
    WHERE 1=1 ${searchQuery}
    ORDER BY ${orderBy} ${order} 
    LIMIT ? OFFSET ?`;

    const connection = await pool.getConnection()
    try{
        const [totalResult]=await connection.query(totalCountQuery,queryParams)
        const [products]=await connection.query(productsQuery,[...queryParams, pageSize,offset])

        const totalCount=totalResult[0].totalCount;
        const totalPages= Math.ceil(totalCount/pageSize);
    
        return {
            currentPage,
            pageSize,
            totalCount,
            totalPages,
            data:products
        }
    }finally{
        connection.release()
    }
}