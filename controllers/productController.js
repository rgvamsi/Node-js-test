const productModel=require('../models/productModel')
exports.getProducts=async(req,res)=>{
    try{
        const {
            currentPage=1,
            pageSize=10,
            orderBy='createdAt',
            orderDir='desc',
            searchBy='',
            searchFields=[]
        }=req.query
        const products=await productModel.getProducts(
            parseInt(currentPage),
            parseInt(pageSize),
            orderBy,
            orderDir,
            searchBy,
            searchFields
        )
        return res.json(products)
    }catch(err){
        console.log("Error: ", err)
        return res.status(500).json({message:"Error while fetching products"})
    }
}