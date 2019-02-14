var SolrNode=require('solr-node');

var clientLocalEscluster= new SolrNode({
    host:'localhost',
    port:8983,
    core:'escluster'
});

var clientLocalEscluster2= new SolrNode({
    host:'217.172.12.219',
    port:8983,
    core:'escluster'
});

var q = clientLocalEscluster.query().q('*:*').rows(1000);

var data;

clientLocalEscluster.search(q,function(err,result){
  if(err){
    console.log(err);
    return
  }
  console.log('Response',result.response.docs.length);
  data=result.response.docs;
  // var toAdd=data[0];
  // delete toAdd._version_;
  // delete toAdd.id;
  var totalIndex=0;
  var sendingIndex=0;
  data.forEach(function(item){

    //setTimeout(myUpdate, 1000,item);
    myUpdate(item);
  });

  function myUpdate(data){
    delete data._version_;
    data.content_txt=data.content;
    data.content_txt_en_split_tight=data.content;
    data.content_txt_en_split=data.content;
    data.content_txt_en=data.content;
    console.log(data["escluster_str_day "]);
    try{
    data.date_dt=new Date(data["escluster_str_day "]).toISOString().replace(":","\:");
    data.date2_dt=new Date(data["escluster_str_day "]).toISOString();
    console.log("sending"+sendingIndex);
    }catch(err){
        console.log(err);
        return;
    }
    sendingIndex++;
    clientLocalEscluster2.update(data,function(err){
      if (err) {
       console.log(err);
       return;
      }
      console.log(totalIndex);
      totalIndex++;
    });
    console.log("mah");
  }

});
