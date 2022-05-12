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
var currentWorkingFile=desktopDir+'/test_new_template';

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
    let readManipulateFile = currentWorkingFile;

     var linkJS = 'var app = angular.module("myApp", ["ngRoute"]);'+
    '\n\tapp.config(function($routeProvider) {'+
      '\n\t\t$routeProvider';

      while(i <app.root.links.length)
      {
        linkName=app.root.links[i].caption;
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

      if(app.root.layout=="hamburger")
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
    let readManipulateFile =currentWorkingFile;
    var i= 0;
    var subFileName="";
    if(app.root.layout=="linktree")
    {
        
        while(i <app.root.links.length)
        {
            try {
                subFileName=app.root.links[i].caption;
                subFileName=subFileName.replace(/\s/g, '');
                if(app.root.framework=="w3css"){
                    fs.copySync('layout_template/'+app.root.framework+'/subpage/'+app.root.layout+'/subpage.html', currentWorkingFile+'/'+subFileName+'.html');
                }
                else{
                    fs.copySync('layout_template/'+app.root.framework+'/subpage/'+app.root.layout+'/subpage.html', currentWorkingFile+'/'+subFileName+'.html');
                }
                
                
                let readManipulateFile = currentWorkingFile+'/'+subFileName+'.html';
                const $ = cheerio.load(fs.readFileSync(readManipulateFile,'utf8'));
                //span naming shouldnt be here
                $('#spanItem').append('<span class="w3-bar-item">'+app.root.links[i].caption+'</span>').html();
                spanHTML=$('*').html();
                fs.writeFileSync(currentWorkingFile+'/'+subFileName+'.html',spanHTML,'utf8');


                console.log(app.root.links[i].caption+' subpage created!');
              } catch (err) {
                console.error(err)
              }
            
            i++;
        }
    }
    else
    {
        while(i <app.root.links.length)
        {
            subFileName = app.root.links[i].caption;
            subFileName=subFileName.replace(/\s/g, '');
            fs.writeFileSync(readManipulateFile+'/'+subFileName+'.html',subFileName,'utf8');

            i++;
        }
        createLinkJSFile();
    }

    


}

var writeNavHTMLFile = function(){
    let readManipulateFile = currentWorkingFile+'/main.html';
    const $ = cheerio.load(fs.readFileSync(readManipulateFile,'utf8'));


    var captionText="";
    var linkText=""
    var linkName=""
    var i = 0

    //BOOTSTRAP W3CSS
    if(app.root.framework=="w3css")
    {
    if(app.root.layout=="tab")
    {
        while(i <app.root.links.length)
        {
            captionText = app.root.links[i].caption;
            linkName = app.root.links[i].caption;
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
    else if(app.root.layout=="hamburger")
    {
        while(i <app.root.links.length)
        {
            captionText = app.root.links[i].caption;
            linkName = app.root.links[i].caption;
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
    else if(app.root.layout=="linktree")
    {
        while(i<app.root.links.length)
        {
            captionText = app.root.links[i].caption;
            linkName = app.root.links[i].caption;
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
    else if(app.root.framework=="bootstrap")
    {
    if(app.root.layout=="tab")
    {
        while(i <app.root.links.length)
        {
            captionText = app.root.links[i].caption;
            linkName = app.root.links[i].caption;
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
    else if(app.root.layout=="hamburger")
    {
        while(i <app.root.links.length)
        {
            captionText = app.root.links[i].caption;
            linkName = app.root.links[i].caption;
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
    else if(app.root.layout=="linktree")
    {
        while(i<app.root.links.length)
        {
            captionText = app.root.links[i].caption;
            linkName = app.root.links[i].caption;
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
    if(fs.existsSync(currentWorkingFile)){
        fs.removeSync(currentWorkingFile);
    }
    
    try {
        fs.copySync('layout_template/'+app.root.framework+'/'+app.root.layout, currentWorkingFile)
        console.log('success created to!'+desktopDir)
        writeNavHTMLFile();
      } catch (err) {
        console.error("No template to be generated")
      }

      writeBackgroundColour();
}


var writeBackgroundColour = function(){
    bgCol = app.root.backgroundColour;
    let readManipulateFile = currentWorkingFile+'/main.html';
    const $ = cheerio.load(fs.readFileSync(readManipulateFile,'utf8'));


    if(app.root.framework=="w3css"){

    if(app.root.layout=="tab")
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
    else if(app.root.layout=="hamburger")
    {
        var oldCol=$('#backgroundColItem').attr('class');
        var newCol=('w3-'+bgCol)+encodeURIComponent(oldCol);

        $('#backgroundColItem').attr('class',newCol).html();

        var colHTML=$('*').html();
        fs.writeFileSync(readManipulateFile,colHTML,'utf8');

    }
    else if(app.root.layout=="linktree")
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
    else if(app.root.framework=="bootstrap")
    {
        if(app.root.layout=="tab")
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
    else if(app.root.layout=="hamburger")
    {
        var oldCol=$('#backgroundColItem').attr('class');
        var newCol=('bg-'+bgCol)+encodeURIComponent(oldCol);

        $('#backgroundColItem').attr('class',newCol).html();

        var colHTML=$('*').html();
        fs.writeFileSync(readManipulateFile,colHTML,'utf8');

    }
    else if(app.root.layout=="linktree")
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

    generateLayoutType();
    
}

var changeSubPageCol = function(){
    var i = 0;
    while(i<app.root.links.length)
    {
        let linkName = app.root.links[i].caption;
        linkName =linkName.replace(/\s/g, '');

        let readManipulateSubFile = currentWorkingFile+'/'+linkName+'.html';
        let $subfile = cheerio.load(fs.readFileSync(readManipulateSubFile,'utf8'));

        var oldSubPageCol = $subfile('#spanItem').attr('class');
        if(app.root.framework=="w3css")
        {
            var newSubPageCol = ('w3-'+bgCol)+encodeURIComponent(oldSubPageCol);
        }
        else if(app.root.framework=="bootstrap")
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

    while(i<app.root.links.length)
    {
        if(app.root.links[i].type=="login")
        {
            if(app.root.layout=="linktree")
            {
               var temp = fs.readFileSync('layout_template/'+app.root.framework+'/page_type/'+app.root.links[i].type+'/'+app.root.links[i].type+'.html','utf8',);
               fs.appendFileSync(currentWorkingFile+'/'+app.root.links[i].caption.replace(/\s/g, '')+'.html',temp);
            }
            else
            {
                fs.copySync('layout_template/'+app.root.framework+'/page_type/'+app.root.links[i].type+'/'+app.root.links[i].type+'.html', currentWorkingFile+'/'+app.root.links[i].caption.replace(/\s/g, '')+'.html');
            }     
            console.log('copy login');
        }
        else if(app.root.links[i].type=="list-paginate")
        {


            if(app.root.layout=="linktree")
            {
                var temp = fs.readFileSync('layout_template/'+app.root.framework+'/page_type/'+app.root.links[i].type+'/'+app.root.links[i].type+'.html','utf8',);
                fs.appendFileSync(currentWorkingFile+'/'+app.root.links[i].caption.replace(/\s/g, '')+'.html',temp);
            }
            else
            {
                fs.copySync('layout_template/'+app.root.framework+'/page_type/'+app.root.links[i].type+'/'+app.root.links[i].type+'.html', currentWorkingFile+'/'+app.root.links[i].caption.replace(/\s/g, '')+'.html');
              
            }

            //create obj file
                fs.copySync('layout_template/'+app.root.framework+'/page_type/'+app.root.links[i].type+'/'+app.root.links[i].type+'-obj.js', currentWorkingFile+'/'+app.root.links[i].type+'-obj.js');
                var obj ="";
                for(var j =0;j<app.root.links[i].listItem.length;j++)
                {
                    obj='{"listCaption":"'+app.root.links[i].listItem[j].listCaption+'","listDescription":"'+app.root.links[i].listItem[j].listDescription+'"},\n';
                    
                    fs.appendFileSync(currentWorkingFile+'/'+app.root.links[i].type+'-obj.js',obj);
                }
                fs.appendFileSync(currentWorkingFile+'/'+app.root.links[i].type+'-obj.js',"];")

                console.log("copy pagination");
            
        }
        else if(app.root.links[i].type=="list")
        {
            if(app.root.layout=="linktree")
            {
               var temp = fs.readFileSync('layout_template/'+app.root.framework+'/page_type/'+app.root.links[i].type+'/'+app.root.links[i].type+'.html','utf8',);
               fs.appendFileSync(currentWorkingFile+'/'+app.root.links[i].caption.replace(/\s/g, '')+'.html',temp);

               var j=0;
               while(j<app.root.links[i].listItem.length)
               {
                if(app.root.framework=="w3css")
                {
                    var tempLi= '<li><span class="w3-large">'+app.root.links[i].listItem[j].listCaption+'</span><br><span>'+app.root.links[i].listItem[j].listDescription+'</span></li>\n'
                    fs.appendFileSync(currentWorkingFile+'/'+app.root.links[i].caption.replace(/\s/g, '')+'.html',tempLi);
                }
                else
                {
                    var tempLi= '<li class="list-group-item"><h5>'+app.root.links[i].listItem[j].listCaption+'</h5><br><p>'+app.root.links[i].listItem[j].listDescription+'</p></li>\n'
                    fs.appendFileSync(currentWorkingFile+'/'+app.root.links[i].caption.replace(/\s/g, '')+'.html',tempLi);
                }
                j++;
               }
            }
            else
            {
                fs.copySync('layout_template/'+app.root.framework+'/page_type/'+app.root.links[i].type+'/'+app.root.links[i].type+'.html', currentWorkingFile+'/'+app.root.links[i].caption.replace(/\s/g, '')+'.html');
                var j=0;
                while(j<app.root.links[i].listItem.length)
                {
                    if(app.root.framework=="w3css")
                    {
                        var tempLi= '<li><span class="w3-large">'+app.root.links[i].listItem[j].listCaption+'</span><br><span>'+app.root.links[i].listItem[j].listDescription+'</span></li>\n'
                        fs.appendFileSync(currentWorkingFile+'/'+app.root.links[i].caption.replace(/\s/g, '')+'.html',tempLi);
                    }
                    else
                    {
                        var tempLi= '<li class="list-group-item"><h5>'+app.root.links[i].listItem[j].listCaption+'</h5><br><p>'+app.root.links[i].listItem[j].listDescription+'</p></li>\n'
                        fs.appendFileSync(currentWorkingFile+'/'+app.root.links[i].caption.replace(/\s/g, '')+'.html',tempLi);
                    }
                    j++;
                }
            }

            fs.appendFileSync(currentWorkingFile+'/'+app.root.links[i].caption.replace(/\s/g, '')+'.html','</ul>');
            console.log('copy list');
        }
        else if(app.root.links[i].type=="tabular")
        {

            if(app.root.layout=="linktree")
            {
                var temp = fs.readFileSync('layout_template/'+app.root.framework+'/page_type/'+app.root.links[i].type+'/'+app.root.links[i].type+'.html','utf8',);
                fs.appendFileSync(currentWorkingFile+'/'+app.root.links[i].caption.replace(/\s/g, '')+'.html',temp);
                
                var j=0;
                while(j<app.root.links[i].tabularItem.length)
                {
                    if(app.root.framework=="w3css")
                    {
                        var tempLi= '\n<a href="'+app.root.links[i].tabularItem[j].caption.replace(/\s/g, '')+'/main.html"><div class="column w3-card-2 w3-hover-shadow w3-center" style="width:33%">'+
                        '\n\t<span style="font-size: 48px; color: Dodgerblue;">'+
                            '\n\t\t<i class="'+app.root.links[i].tabularItem[j].icon+'"></i>'+
                        '\n\t</span>'+
                        '\n\t<div class="w3-container w3-center">'+
                          '\n\t\t<p>'+app.root.links[i].tabularItem[j].caption+'</p>'+
                        '\n\t</div>'+
                      '\n</div></a>'
                        
                        fs.appendFileSync(currentWorkingFile+'/'+app.root.links[i].caption.replace(/\s/g, '')+'.html',tempLi);
                    }
                    else
                    {
                        var tempLi='\n<a href="'+app.root.links[i].tabularItem[j].caption.replace(/\s/g, '')+'/main.html"><div class="column card" style="width:33%">'+
                        '\n\t<span style="font-size: 48px; color: Dodgerblue;">'+
                        '\n\t\t<i class="'+app.root.links[i].tabularItem[j].icon+'"></i>'+
                        '\n\t</span>'+
                        '\n\t<div class="card-body">'+
                        '\n\t\t<h4 class="card-title">'+app.root.links[i].tabularItem[j].caption+'</h4>'+
                        '\n\t</div>'+
                        '\n</div></a>';
                        fs.appendFileSync(currentWorkingFile+'/'+app.root.links[i].caption.replace(/\s/g, '')+'.html',tempLi);
                    }
                    
                    var tempWorkingFile=currentWorkingFile;
                    var tempApp=app;
                      if(app.root.links[i].tabularItem[j].link!=null)
                      {
                          
                          currentWorkingFile = currentWorkingFile+'/'+app.root.links[i].tabularItem[j].caption.replace(/\s/g, '');
                          app=app.root.links[i].tabularItem[j].link;
                          
                          generateLayout();
                      }
                      app=tempApp;
                      currentWorkingFile=tempWorkingFile;

                    j++;


                }

                fs.appendFileSync(currentWorkingFile+'/'+app.root.links[i].caption.replace(/\s/g, '')+'.html','\n</div>');
                console.log("copy tabular")
            }
            else
            {
                fs.copySync('layout_template/'+app.root.framework+'/page_type/'+app.root.links[i].type+'/'+app.root.links[i].type+'.html', currentWorkingFile+'/'+app.root.links[i].caption.replace(/\s/g, '')+'.html');
                var j=0;
                while(j<app.root.links[i].tabularItem.length)
                {
                    if(app.root.framework=="w3css")
                    {
                        var tempLi= '\n<a href="'+app.root.links[i].tabularItem[j].caption.replace(/\s/g, '')+'/main.html"><div class="column w3-card-2 w3-hover-shadow w3-center" style="width:33%">'+
                        '\n\t<span style="font-size: 48px; color: Dodgerblue;">'+
                            '\n\t\t<i class="'+app.root.links[i].tabularItem[j].icon+'"></i>'+
                        '\n\t</span>'+
                        '\n\t<div class="w3-container w3-center">'+
                          '\n\t\t<p>'+app.root.links[i].tabularItem[j].caption+'</p>'+
                        '\n\t</div>'+
                      '\n</div></a>'
                        
                        fs.appendFileSync(currentWorkingFile+'/'+app.root.links[i].caption.replace(/\s/g, '')+'.html',tempLi);
 
                
                    }
                    else
                    {
                        var tempLi='\n<a href="'+app.root.links[i].tabularItem[j].caption.replace(/\s/g, '')+'/main.html"><div class="column card" style="width:33%">'+
                        '\n\t<span style="font-size: 48px; color: Dodgerblue;">'+
                        '\n\t\t<i class="'+app.root.links[i].tabularItem[j].icon+'"></i>'+
                        '\n\t</span>'+
                        '\n\t<div class="card-body">'+
                        '\n\t\t<h4 class="card-title">'+app.root.links[i].tabularItem[j].caption+'</h4>'+
                        '\n\t</div>'+
                        '\n</div></a>';
                        fs.appendFileSync(currentWorkingFile+'/'+app.root.links[i].caption.replace(/\s/g, '')+'.html',tempLi);
                    }

                    var tempWorkingFile=currentWorkingFile;
                    var tempApp=app;
                    if(app.root.links[i].tabularItem[j].link)
                      {
                          
                          currentWorkingFile = currentWorkingFile+'/'+app.root.links[i].tabularItem[j].caption.replace(/\s/g, '');
                          app=app.root.links[i].tabularItem[j].link;
                          
                          generateLayout();
                      }
                      app=tempApp;
                      currentWorkingFile=tempWorkingFile;
                    j++;
                }

                fs.appendFileSync(currentWorkingFile+'/'+app.root.links[i].caption.replace(/\s/g, '')+'.html','\n</div>');
                console.log("copy tabular")

                
                
                
            }
     
        }
        else
        {
            console.log(app.root.links[i].caption+" has no type define")
        }
        i++;
    }
}


const run = async()=>
{
    clear();
    //to initialised app object on the first level from json file
    readJSONTemplate();
    console.log(app.root.framework)
    generateLayout();
    process.exit(1);

    
    
    
}

run();