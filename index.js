const clear = require("clear");
const readline = require('readline');
const fs = require('fs-extra');
const cheerio = require('cheerio');
const path = require('path');
const fse =require('fs-extra');
const os = require('os');
const { link } = require("fs");

//desktop path directory
const desktopDir= path.join(os.homedir(),"Desktop");

//read input in console
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var app = "";

var readJSONTemplate = function(){
    try{
        const jsonString= fs.readFileSync("user_input/app-struct.json");
        app = JSON.parse(jsonString);
        console.log("successfully read JSON ");
        
    }
    catch(err){
        console.log(err);
    }
}

var createLinkJSFile = function()
{
    var i= 0;
    var linkText="";
    var linkName="";
    let readManipulateFile = desktopDir+'/test_new_template';

     var linkJS = 'var app = angular.module("myApp", ["ngRoute"]);'+
    '\n\tapp.config(function($routeProvider) {'+
      '\n\t\t$routeProvider';

      while(i <app.pages.page.length)
      {
        linkName=app.pages.page[i].caption;
        linkName=linkName.replace(/\s/g, '');
          if(i==0)
          {
            linkText = '\n\t\t.when("/", {templateUrl : "'+linkName+'.html"})\n\t\t'
          }
          else
          {
            linkText = '\n\t\t.when("/'+linkName+'", {templateUrl : "'+linkName+'.html"})\n\t\t'
          }
          
          
          linkJS+=linkText;

          i++
      }
      
      linkJS+='\n});';

      if(app.layout=="template2")
      {
        linkJS+='function w3_open() {'+
        'document.getElementById("mySidebar").style.display = "block";'+
      '}'+
      
      'function w3_close() {'+
        'document.getElementById("mySidebar").style.display = "none";'+
      '}';
      }
      

      fs.writeFileSync(readManipulateFile+'/link.js',linkJS,'utf8');

    
}

var createSubPage = function(){
    let readManipulateFile = desktopDir+'/test_new_template';
    var i= 0;
    var subFileName="";
    

    


    if(app.layout=="template3")
    {
        
        while(i <app.pages.page.length)
        {
            try {
                subFileName=app.pages.page[i].caption;
                subFileName=subFileName.replace(/\s/g, '');
                if(app.framework=="w3css"){
                    fs.copySync('layout_template/'+app.framework+'/subpage/'+app.layout+'/subpage.html', desktopDir+'/test_new_template/'+subFileName+'.html');
                }
                else{
                    fs.copySync('layout_template/'+app.framework+'/subpage/'+app.layout+'/subpage.html', desktopDir+'/test_new_template/'+subFileName+'.html');
                }
                
                
                let readManipulateFile = desktopDir+'/test_new_template/'+subFileName+'.html';
                const $ = cheerio.load(fs.readFileSync(readManipulateFile,'utf8'));
                //span naming shouldnt be here
                $('#spanItem').append('<span class="w3-bar-item">'+subFileName+'</span>').html();
                spanHTML=$('*').html();
                fs.writeFileSync(desktopDir+'/test_new_template/'+subFileName+'.html',spanHTML,'utf8');


                console.log(app.pages.page[i].caption+' subpage created!');
              } catch (err) {
                console.error(err)
              }
            
            i++;
        }
    }
    else
    {
        while(i <app.pages.page.length)
        {
            subFileName = app.pages.page[i].caption;
            subFileName=subFileName.replace(/\s/g, '');
            fs.writeFileSync(readManipulateFile+'/'+subFileName+'.html',subFileName,'utf8');

            i++;
        }
        createLinkJSFile();
    }

    


}

var writeNavHTMLFile = function(){
    let readManipulateFile = desktopDir+'/test_new_template/main.html';
    const $ = cheerio.load(fs.readFileSync(readManipulateFile,'utf8'));


    var captionText="";
    var linkText=""
    var linkName=""
    var i = 0

    //BOOTSTRAP W3CSS
    if(app.framework=="w3css")
    {
    if(app.layout=="template1")
    {
        while(i <app.pages.page.length)
        {
            captionText = app.pages.page[i].caption;
            linkName = app.pages.page[i].caption;
            linkName =linkName.replace(/\s/g, '');
            if(i==0)
            {
                linkText ='\n\t\t<a href="#/!" class="w3-bar-item w3-button w3-mobile" id="'+captionText+'">'+captionText+'</a>\n'
            }
            else{
                linkText = '\n\t\t<a href="#!'+linkName+'"  class="w3-bar-item w3-button w3-mobile" id="'+captionText+'">'+captionText+' Link</a>\n'
            }
        
            $('#navItem').append(linkText).html();
            navHTML=$("*").html();
            fs.writeFileSync(readManipulateFile,navHTML,'utf8');

            i++;
        }
    }
    else if(app.layout=="template2")
    {
        while(i <app.pages.page.length)
        {
            captionText = app.pages.page[i].caption;
            linkName = app.pages.page[i].caption;
            linkName =linkName.replace(/\s/g, '');
            if(i==0)
            {
                linkText ='\n\t\t\t\t<a href="#/!" class="w3-bar-item w3-button w3-mobile" id="'+captionText+'">'+captionText+'</a>\n'
            }
            else{
                linkText = '\n\t\t\t\t<a href="#!'+linkName+'"  class="w3-bar-item w3-button w3-mobile" id="'+captionText+'">'+captionText+' Link</a>\n'
            }
        
            $('[name=navItem]').append(linkText).html();
            navHTML=$("*").html();
            fs.writeFileSync(readManipulateFile,navHTML,'utf8');

            i++;
        }
    }
    else if(app.layout=="template3")
    {
        while(i<app.pages.page.length)
        {
            captionText = app.pages.page[i].caption;
            linkName = app.pages.page[i].caption;
            linkName =linkName.replace(/\s/g, '');
            

            linkText='\t<a href="'+linkName+'.html">'+
            '\n\t\t\t\t<br>'+
            '\n\t\t\t\t<div class="link-box mt-3 w3-round-xxlarge"> '+captionText +' link</div>'+
            '\n\t\t\t\t<br>'+
            '\n\t\t\t</a>';

            $('#navItem').append(linkText).html();
            navHTML=$("*").html();

            fs.writeFileSync(readManipulateFile,navHTML,'utf8');
            
            
            

            i++;

        }
    }
    else
    {
        console.log("no template defined");
    }

    }
    //BOOTSTRAP FRAMEWORK
    else if(app.framework=="bootstrap")
    {
    if(app.layout=="template1")
    {
        while(i <app.pages.page.length)
        {
            captionText = app.pages.page[i].caption;
            linkName = app.pages.page[i].caption;
            linkName =linkName.replace(/\s/g, '');
            if(i==0)
            {
                linkText ='\n\t\t<li><a href="#/!">'+captionText+'</a></li>\n'
            }
            else{
                linkText = '\n\t\t<li><a href="#!'+linkName+'">'+captionText+'</a></li>\n'
            }
        
            $('#navItem').append(linkText).html();
            navHTML=$("*").html();
            fs.writeFileSync(readManipulateFile,navHTML,'utf8');

            i++;
        }
    }
    else if(app.layout=="template2")
    {
        while(i <app.pages.page.length)
        {
            captionText = app.pages.page[i].caption;
            linkName = app.pages.page[i].caption;
            linkName =linkName.replace(/\s/g, '');
            if(i==0)
            {
                linkText ='\n\t\t\t\t\t\t\t\t\t<li><a href="#/!">'+captionText+'</a></li>\n'
            }
            else{
                
                linkText = '\n\t\t\t\t\t\t\t\t<li><a href="#!'+linkName+'">'+captionText+'</a></li>\n'
            }
        
            $('[name=navItem]').append(linkText).html();
            navHTML=$("*").html();
            fs.writeFileSync(readManipulateFile,navHTML,'utf8');

            i++;
        }
    }
    else if(app.layout=="template3")
    {
        while(i<app.pages.page.length)
        {
            captionText = app.pages.page[i].caption;
            linkName = app.pages.page[i].caption;
            linkName =linkName.replace(/\s/g, '');
            

            linkText='\t<a href="'+linkName+'.html">'+
            '\n\t\t\t\t<br>'+
            '\n\t\t\t\t<div class="link-box mt-3 img-rounded"> '+captionText +' link</div>'+
            '\n\t\t\t\t<br>'+
            '\n\t\t\t</a>';

            $('#navItem').append(linkText).html();
            navHTML=$("*").html();

            fs.writeFileSync(readManipulateFile,navHTML,'utf8');
            
            
            

            i++;

        }
    }
    else{
        console.log("no template defined");
    }
    }
    else{
        console.log("no framework defined");
    }
    
    
    console.log("done append!");
    createSubPage();

}



var generateLayout = function(){

    //allow user to remove/edit the json data by overwritting it
    if(fs.existsSync(desktopDir+'/test_new_template')){
        fs.removeSync(desktopDir+'/test_new_template');
    }
    //copy to desktop
    try {
        fs.copySync('layout_template/'+app.framework+'/'+app.layout, desktopDir+'/test_new_template')
        console.log('success created to!'+desktopDir)
        writeNavHTMLFile();
      } catch (err) {
        console.error("No template to be generated")
      }

}

var writeBackgroundColour = function(){
    bgCol = app.backgroundColour;
    let readManipulateFile = desktopDir+'/test_new_template/main.html';
    const $ = cheerio.load(fs.readFileSync(readManipulateFile,'utf8'));


    if(app.framework=="w3css"){

    if(app.layout=="template1")
    {
        var oldNavCol=$('#navItem').attr('class');
        var oldFooterCol=$('#footerItem').attr('class');

        var newNavCol=('w3-bar w3-'+bgCol)+encodeURIComponent(oldNavCol);   
        var newFooterCol=('w3-container w3-padding-32 w3-center w3-'+bgCol)+encodeURIComponent(oldFooterCol); 

        //nav recolor
        $('#navItem').attr('class',newNavCol).html();
        var colHTML=$('*').html();
        //footer recolor
        $('#footerItem').attr('class',newFooterCol).html();
        colHTML=$('*').html();

        fs.writeFileSync(readManipulateFile,colHTML,'utf8');

    }
    else if(app.layout=="template2")
    {
        var oldCol=$('#backgroundColItem').attr('class');
        var newCol=('w3-'+bgCol)+encodeURIComponent(oldCol);

        $('#backgroundColItem').attr('class',newCol).html();

        var colHTML=$('*').html();
        fs.writeFileSync(readManipulateFile,colHTML,'utf8');

    }
    else if(app.layout=="template3")
    {
        var oldCol=$('#backgroundColItem').attr('class');
        var newCol=('w3-container w3-'+bgCol)+encodeURIComponent(oldCol);
        var newFooterCol=('w3-container w3-padding-32 w3-center w3-'+bgCol)+encodeURIComponent(oldCol);
        $('#backgroundColItem').attr('class',newCol).html();

        var colHTML=$('*').html();
        fs.writeFileSync(readManipulateFile,colHTML,'utf8');

        $('#navItem').attr('class',newNavCol).html();
        var colHTML=$('*').html();

        //footer recolor
        $('#backgroundColFooterItem').attr('class',newFooterCol).html();
        var colHTML=$('*').html();
        fs.writeFileSync(readManipulateFile,colHTML,'utf8');




        //change colour for subfile
        changeSubPageCol();
    }
    else
    {
        console.log("Layout receive unavailable. Program will end now");
        
    }
    }
    else if(app.framework=="bootstrap")
    {
        if(app.layout=="template1")
    {
        var oldNavCol=$('#navItemCol').attr('class');
        var oldFooterCol=$('#footerItem').attr('class');

        var newNavCol=('navbar text-center bg-'+bgCol)+encodeURIComponent(oldNavCol);   
        var newFooterCol=('page-footer font-small bg-'+bgCol)+encodeURIComponent(oldFooterCol); 

        //nav recolor
        $('#navItemCol').attr('class',newNavCol).html();
        var colHTML=$('*').html();
        //footer recolor
        $('#footerItem').attr('class',newFooterCol).html();
        colHTML=$('*').html();

        fs.writeFileSync(readManipulateFile,colHTML,'utf8');

    }
    else if(app.layout=="template2")
    {
        var oldCol=$('#backgroundColItem').attr('class');
        var newCol=('bg-'+bgCol)+encodeURIComponent(oldCol);

        $('#backgroundColItem').attr('class',newCol).html();

        var colHTML=$('*').html();
        fs.writeFileSync(readManipulateFile,colHTML,'utf8');

    }
    else if(app.layout=="template3")
    {
        var oldCol=$('#backgroundColItem').attr('class');
        var newCol=('bg-'+bgCol)+encodeURIComponent(oldCol);
        var newFooterCol=('bg-'+bgCol)+encodeURIComponent(oldCol);
        $('#backgroundColItem').attr('class',newCol).html();

        var colHTML=$('*').html();
        fs.writeFileSync(readManipulateFile,colHTML,'utf8');


        $('#backgroundColFooterItem').attr('class',newFooterCol).html();
        var colHTML=$('*').html();
        fs.writeFileSync(readManipulateFile,colHTML,'utf8');

        //change colour for subfile
        changeSubPageCol();
    }
    else
    {
        console.log("Layout receive unavailable. Program will end now");
        
    }
    }
    else{
        console.log("no framework defined");
    }
    
}

var changeSubPageCol = function(){
    var i = 0;
    while(i<app.pages.page.length)
    {
        let linkName = app.pages.page[i].caption;
        linkName =linkName.replace(/\s/g, '');

        let readManipulateSubFile = desktopDir+'/test_new_template/'+linkName+'.html';
        let $subfile = cheerio.load(fs.readFileSync(readManipulateSubFile,'utf8'));

        var oldSubPageCol = $subfile('#spanItem').attr('class');
        if(app.framework=="w3css")
        {
            var newSubPageCol = ('w3-'+bgCol)+encodeURIComponent(oldSubPageCol);
        }
        else if(app.framework=="bootstrap")
        {
            var newSubPageCol = ('bg-'+bgCol)+encodeURIComponent(oldSubPageCol);
        }
        else
        {
            console.log('no template define')
        }
        

        $subfile('#spanItem').attr('class',newSubPageCol).html();

        var colSubPageHTML=$subfile('*').html();
        fs.writeFileSync(readManipulateSubFile,colSubPageHTML,'utf8');

      
        

        i++;
    }
}

var generateLayoutType = function()
{
    var i = 0;

    while(i<app.pages.page.length)
    {
        if(app.pages.page[i].type=="login")
        {
            if(app.layout=="template3")
            {
               var temp = fs.readFileSync('layout_template/'+app.framework+'/page_type/'+app.pages.page[i].type+'/'+app.pages.page[i].type+'.html','utf8',);
               fs.appendFileSync(desktopDir+'/test_new_template/'+app.pages.page[i].caption+'.html',temp);
            }
            else
            {
                fs.copySync('layout_template/'+app.framework+'/page_type/'+app.pages.page[i].type+'/'+app.pages.page[i].type+'.html', desktopDir+'/test_new_template/'+app.pages.page[i].caption+'.html');
            }
            
            console.log('copy login');
        }
        else if(app.pages.page[i].type=="list-paginate")
        {
            
        }
        else if(app.pages.page[i].type=="list")
        {
            
        }
        else if(app.pages.page[i].type=="tabular")
        {
            
        }
        else
        {
            console.log(app.pages.page[i].caption+" has no type define")
        }
        i++;
    }
}


const run = async()=>
{
    clear();
    readJSONTemplate();
    generateLayout();
    console.log("finish");
    writeBackgroundColour();
    generateLayoutType();
    
    

    console.log("end");
    process.exit(1);

    
    
    
}

run();