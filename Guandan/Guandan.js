var Guandan={};
Guandan.Init=function(canvasID){
	JFunction.PreLoadData(GMain.URL).done(function () {
        JMain.JForm=new JControls.Form(GMain.Size,canvasID).setBGImage(ResourceData.Images.bg1);
        JMain.JForm.clearControls();
        GMain.BtnPanel=new JControls.Object({x:100,y:280},{width:600,height:50});//用于显示游戏控制按钮
        GMain.PokerPanel0=new GControls.PokerPanel({x:100,y:5},{width:600,height:120},0,0);//用于显示底牌，显示对象存储在GMain.Poker[0]
        GMain.PokerPanel1=new GControls.PokerPanel({x:200,y:355},{width:400,height:120},1,20);//用于显示自己的牌，显示对象存储在GMain.Poker[1]
        GMain.PokerPanel2=new GControls.PokerPanel({x:695,y:60},{width:100,height:440},2,25);//用于显示右边电脑的牌，显示对象存储在GMain.Poker[2]
        GMain.PokerPanel3=new GControls.PokerPanel({x:5,y:60},{width:100,height:440},3,25);//用于显示左边电脑的牌，显示对象存储在GMain.Poker[3]
        GMain.PokerPanel4=new GControls.PokerPanel({x:200,y:150},{width:400,height:120},4,20);//用于显示出的最后一手牌，显示对象存储在GMain.Poker[4]
        var BeginButton=new JControls.Button({x:235,y:0},{width:130,height:50}).setText("开始").setBGImage(ResourceData.Images.btn);
        BeginButton.onClick=function(){
            GMain.BtnPanel.visible=false;
            Guandan.Dealing();
        }
        GMain.BtnPanel.addControlInLast([BeginButton]);
        JMain.JForm.addControlInLast([GMain.PokerPanel0,GMain.PokerPanel1
            ,GMain.PokerPanel2,GMain.PokerPanel3,GMain.PokerPanel4,GMain.BtnPanel]);
        Guandan.InitGame();
        JMain.JForm.show();

    });
}
Guandan.InitGame=function(){
    GMain.Poker=[];
    for(var i=0;i<5;i++)GMain.Poker[i]=[];//初始化扑克对象存储空间
    for(var j=0;j<54;j++)GMain.Poker[0][j]=new GControls.Poker(j+1);//生成扑克对象
    GMain.PokerPanel0.hidePoker=false;//hidePoker为true，显示扑克背面
    GMain.PokerPanel1.hidePoker=false;//hidePoker为false，显示扑克正面
    GMain.PokerPanel2.hidePoker=false;
    GMain.PokerPanel3.hidePoker=false;
    GMain.PokerPanel4.hidePoker=false;
    GMain.PokerPanel1.toSelectPoker=false;
    GMain.PokerPanel0.density=1;//设置扑克牌显示密度
    GMain.ToPlay=false;    GMain.LastHandPokerType=null;
    GMain.DealingNum=0;
    GMain.DealerNum=JFunction.Random(1,3);
    GMain.BeginNum=GMain.DealerNum;//初始化发牌起始标识
}
var GMain={
    Size:{width:800, height:480}//屏幕大小
    ,URL:""
    ,Poker:null
    ,LandlordNum:null//地主编号
    ,BeginNum:null//发牌开始编号
    ,DealerNum:null//当前操作编号
    ,MaxScore:null//抢牌最高分
    ,GrabTime:null//抢牌次数
    ,DealingHandle:null//发牌句柄
    ,DealingNum:null//已发牌数
    ,PokerSize:{width:100,height:120}//扑克牌大小
    ,LastHandNum:null//标示谁出的最后一手牌
    ,LastHandPokerType:null//最后一手牌类型
    ,ToPlay:null//已抢完地主，出牌中
    ,PokerTypes:{//扑克牌类型
        "1":{weight:1,allNum:1,minL:5,maxL:12}
        ,"11":{weight:1,allNum:2,minL:3,maxL:10}
        ,"111":{weight:1,allNum:3,minL:1,maxL:6}
        ,"1111":{weight:2,allNum:4,minL:1,maxL:1}
        ,"1112":{weight:1,zcy:"111",fcy:"1",fcyNum:1,allNum:4,minL:1,maxL:5}
        ,"11122":{weight:1,zcy:"111",fcy:"11",fcyNum:1,allNum:5,minL:1,maxL:4}
        ,"111123":{weight:1,zcy:"1111",fcy:"1",fcyNum:2,allNum:6,minL:1,maxL:1}
        ,"11112233":{weight:1,zcy:"1111",fcy:"11",fcyNum:2,allNum:8,minL:1,maxL:1}
        ,"12":{weight:3,allNum:2,minL:1,maxL:1}
    }
}
var GControls={};
GControls.Poker=Class.create(JControls.Object,{
    pokerNumber:null
    ,seNumber:null
    ,imageData:null
    ,isHidePoker:true
    ,isSelected:null
    ,initialize:function ($super,imageName){
        $super();
        this.setSize(GMain.PokerSize);
        this.imageData=ResourceData.Images[imageName];
        this.pokerNumber=this.imageData.num;
        this.seNumber=this.imageData.se;
        this.isSelected=false;
    }
    ,beginShow:function($super){
        $super();
         this.setBGImage(this.imageData);
    }
    ,onClick:function(){
        if(this.parent.toSelectPoker){
            this.isSelected=!this.isSelected;
            JMain.JForm.show();
            return true;
        }
        return false;
    }
});
GControls.GrabButton=Class.create(JControls.Button,{
    score:null
    ,initialize:function ($super,  argP, argWH,score) {
        $super( argP, argWH);
        this.score=score;
        if(this.score&&this.score<=GMain.MaxScore)this.visible=false;
    }
    ,onClick:function(){
        if(this.score){
            GMain.MaxScore=this.score;
            GMain.LandlordNum=GMain.DealerNum;
        }
        GMain.DealerNum++;
        GMain.GrabTime++;
        GMain.BtnPanel.visible=false;
        DJDDZ.GrabTheLandlord();
        return true;
    }
});
GControls.PokerPanel=Class.create(JControls.Object,{
    pokerPanelNum:null
    ,hidePoker:null
    ,density:null
    ,toSelectPoker:null
    ,initialize:function ($super,argP, argWH,num,density){
        $super(argP, argWH);
        this.pokerPanelNum=num;
        //this.hidePoker=hidePoker;
        if(density!=null)this.density=density;
        else this.density=20;
    }
    ,beginShow:function($super){
        GMain.Poker[this.pokerPanelNum].sort(sortNumber);
        var l=GMain.Poker[this.pokerPanelNum].length;
        for(var i=0;i<l;i++){
            var x= 0,y= 0;
            if(this.pokerPanelNum==2||this.pokerPanelNum==3){//竖直
                var h=GMain.PokerSize.height+(l-1)*this.density;
                y=(this.size.height-h)/2.0+i*this.density;
            }else{//水平
                var w=GMain.PokerSize.width+(l-1)*this.density;
                x=(this.size.width-w)/2.0+i*this.density;
                if(this.toSelectPoker&&GMain.Poker[this.pokerPanelNum][i].isSelected) y=-20;
            }
            GMain.Poker[this.pokerPanelNum][i].setRelativePosition({x:x,y:y});
            if(this.hidePoker)GMain.Poker[this.pokerPanelNum][i].isHidePoker=true;
            else GMain.Poker[this.pokerPanelNum][i].isHidePoker=false;
        }
        this.clearControls();
        this.addControlInLast(GMain.Poker[this.pokerPanelNum]);
        if(GMain.ToPlay){
            var label1=new JControls.Label().setFontType("bold").setFontSize(20).setTextAlign("left").setTextBaseline("bottom").setFontColor(JColor.red);
            var label2=new JControls.Label().setFontType("bold").setFontSize(20).setTextAlign("left").setTextBaseline("bottom").setFontColor(JColor.blue);
            if(this.pokerPanelNum==GMain.LandlordNum)label1.setText("地主")
            else label1.setText("")
            if(this.pokerPanelNum==GMain.LastHandNum)label2.setText("出牌")
            else label2.setText("")
            if(this.pokerPanelNum==1){
                label1.setRelativePosition({x:80,y:-30});
                label2.setRelativePosition({x:200,y:-30});
                this.addControlInLast([label1,label2]);
            }else if(this.pokerPanelNum==2){
                label1.setRelativePosition({x:-30,y:50});
                label2.setRelativePosition({x:-30,y:150});
                this.addControlInLast([label1,label2]);
            }else if(this.pokerPanelNum==3){
                label1.setRelativePosition({x:105,y:50});
                label2.setRelativePosition({x:105,y:150});
                this.addControlInLast([label1,label2]);
            }
        }
        $super();
        function sortNumber(a, b){
            if(b.pokerNumber==a.pokerNumber)return b.seNumber- a.seNumber;
            else return b.pokerNumber-a.pokerNumber;
        }
    }
});
Guandan.Dealing=function(){//发牌
    if(GMain.DealingHandle){clearTimeout(GMain.DealingHandle);}
    if(GMain.DealingNum>=108) {//已发完牌
        
    }else{
       //alert("DealerNum"+GMain.DealerNum);
      //  alert("DealingNum"+ GMain.DealingNum);
        if(GMain.DealerNum>3) GMain.DealerNum=0;
        var r=JFunction.Random(0,GMain.Poker[0].length-1);
       // alert("r:"+r);
       // alert(GMain.Poker[0].length-1);
       //alert("DealerNum"+GMain.DealerNum+" r:"+r+" "+"GMain.Poker[0][r]: "+GMain.Poker[0][r]);
       GMain.Poker[GMain.DealerNum].splice(GMain.Poker[ GMain.DealerNum].length,0,GMain.Poker[0][r]);
        
        //添加按钮
        GMain.Poker[0].splice(r,1);
        GMain.DealingNum++;
        GMain.DealerNum++;
        //alert("Guandan.Dealing:"+Guandan.Dealing);
        GMain.DealingHandle=setTimeout(Guandan.Dealing, 40);//40毫秒发一张牌
        JMain.JForm.show();
        //alert("ok");
    }
}