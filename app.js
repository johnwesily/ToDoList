const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const ejs=require("ejs");

const date=require(__dirname+"/date.js");
const mongoose=require("mongoose");
const _=require("lodash");


const items=[];
const workitems=[];

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extened: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://john:Test-1234@cluster0.kacofmo.mongodb.net/todolist?retryWrites=true&w=majority");

const itemSchema={

  name:String
};

const Item=mongoose.model("Item",itemSchema);


const listSchema ={
  name:String,
  items:[itemSchema]
}

const List=mongoose.model("List",listSchema);


const item1= new Item({
  name:"enter into the list"
})
const item2=new Item({
  name:"click add to add object into the list"
})
const item3=new Item({
  name:"check the checkbox to deletea the item form the list"
})

const defaultItems={item1,item2,item3};

app.listen(3000||proces.env.PORT,function(){
  console.log("server is listening to the port 3000");
})



app.get("/",function(req,res){

   const day=date.getDate();
   Item.find({}).then(function(foundItems){
       res.render("list",{listTitle: "today",newListItems :foundItems});
   })
  .catch(function(err){
    console.log(err);
  })

});


app.post("/",function(req,res){
  const itemName =req.body.newitems ;
  const listname=req.body.list;

  const item=new Item({
    name:itemName
  });

  if(listname ==="today"){
    item.save();
    res.redirect("/");
  }
else{
//   List.findOne({name:listname}).exec()
//   .then(foundList=>{
//     foundList.items.push(item)
//     foundList.save();
//     res.redirect("/"+listname)
//   })
//   .catch(err=>{
//     console.log(err);
//   })
// }


List.findOne({name:listname}).then(function(foundList){
  foundList.items.push(item);
  foundList.save();
  res.redirect("/"+listname);
})
.catch(function(err){
  console.log(err);
})
}

});




app.post("/delete",function(req,res){
    const checkedItemId=req.body.checkbox;
    const listName=req.body.listName;

    if(listName=="today"){
      console.log(checkedItemId);
     Item.findByIdAndRemove(checkedItemId).then(function(del){
       if(del){
         console.log("deleted");
         res.redirect("/");
       }
     })
     .catch(function(err){
       console.log(err);
     })
    }
    else{
      List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}})
      .then(function(del){
        if(del){
          console.log("deleted");
          res.redirect("/"+listName);
        }
      })
      .catch(function(err){
        console.log(err);
      })
    }


      // console.log(product);
  });



app.get("/:customListName",function(req,res){
  const customListname=_.capitalize(req.params.customListName);



 List.findOne({name:customListname})
 .then(function(founditems){
   if(!founditems){
     const list =new List({
       name:customListname,
       items:defaultItems
     });

   list.save();
   console.log("saved");
   res.redirect("/"+customListname);
 }

   else{
     res.render("list",{listTitle:founditems.name,newListItems:founditems.items});
   }
 })

 .catch(function(err){
   console.log(err);
 })



})



app.post("/work",function(res,req){
  const item=req.body.newitems;
  workitmes.push(items);

   res.redirect("/work");
});



app.get("/about",function(req,res){
  res.render("about");
});
