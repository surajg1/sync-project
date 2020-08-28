create table using sequelize
    1) product info (id, name, desc, catid, catname, subcatid, subcatname, brandid, brandname, modifieddate)
    2) mrp-discount table (id, mrp, discount, modifieddate)

 

1) create api for insert data in this two table using sequelize
2) after data insert create sync for (data insert postgres to elastic-serach)
3) then create api for get data from elastic serach and show user this response stored 
    in redis for 10 min
