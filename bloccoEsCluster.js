var SolrNode=require('solr-node');


SolrNode.prototype.myUpdate = function(data,finalCallback) {
  console.log('myUpdate'+data);
  var bodyData;
  var  options = { commit: true,overwrite:true,wt:'json'}; // 'commit:true' option is default
  bodyData = data;
  this._requestPost("update", bodyData, options, finalCallback);
};

var clientLocalEscluster= new SolrNode({
    host:'localhost',
    port:8983,
    core:'clusters_2000_2019_sim_matrix'
});

// var clientLocalEscluster2= new SolrNode({
//     host:'solr:D1Sc0V3R1@217.172.12.219',
//     port:8983,
//     core:'escluster'
// });

var clientLocalEscluster2= new SolrNode({
    host:'solr:D1Sc0V3R1@217.172.12.219',
    port:8983,
    core:'clusters_2000_2019_sim_matrix'
});

var q = clientLocalEscluster.query().q('*:*').rows(60000);

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
  var newDataList=[];
  data.forEach(function(item){
    console.log(item);
    try{
      newDataList.push(dataUpdate(item));
    }catch(err){
      console.log(err);
    }
  });

  clientLocalEscluster2.myUpdate(newDataList,function(err,response){
    if (err) {
     console.log(err);
     return;
    }
    console.info(response);
  });

  function dataUpdate(data){
    delete data._version_;
    data.content_txt=data.content;
    data.content_txt_en_split_tight=data.content;
    data.content_txt_en_split=data.content;
    data.content_txt_en=data.content;
    //data.cluster_h_txt=data.cluster_h
    //data.date_dt=new Date(data["date "]).toISOString().replace(":","\:");
    //data.date2_dt=new Date(data["escluster_str_day "]).toISOString();
    return data;
  }

});
