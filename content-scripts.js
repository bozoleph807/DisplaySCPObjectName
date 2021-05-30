
//[location.pathname]が「scp-###」「scp-####」の場合
if (/scp.\d{3,4}/.test(location.pathname))
{
	var itemName = location.pathname.replace(/\//, '');	//SCPアイテム名（「scp-####」）を取得する
	var itemNumber = location.pathname.replace(/\D/g, '');	//SCPアイテムの数値部分のみ
}

//アイテム番号からシリーズ番号を生成
var seriesNumber = Math.ceil((Number(itemNumber)+1)/1000);

//シリーズ番号が非数値の場合の処理
if (isNaN(seriesNumber))
{
	exit;							//何もしないで終了する
}

//シリーズ一覧のpathname枝番部を生成する
if(seriesNumber > 1)
{
	seriesbranch = '-'+seriesNumber;
}
else
{
	seriesbranch = '';
}

var seriesPathName = location.pathname.replace(/\d{3,4}/,'series') + seriesbranch;

var seriesUrl = 'http://' + location.hostname + seriesPathName;

//SCP一覧ページのXMLHttpRequestを生成する
var xhr = new XMLHttpRequest();
xhr.open('GET',seriesUrl,false);
xhr.send(null);

//SCP一覧ページを分割して配列に格納する
var scphtml = xhr.responseText;
var htmlarray = scphtml.split(/\r\n|\r|\n/);

//SCPリスト生成用の正規表現を登録
var regExp = /scp-(?:pl-|cn-)?\d{3,4}(?:-(?:jp|ru|ko|fr|th|de|it))?/;

//配列にSCPリストを格納する
for(i = 0; i < htmlarray.length; i++){
	//値に「scp-[3,4桁の数字](-jp|ko|fr|th|de|it)」が含まれている場合
	if(regExp.test(htmlarray[i])){
		//SCPキーを抜き出す
		var scpkey=regExp.exec(htmlarray[i]);

		//SCP名を抜き出す
		var scpname=htmlarray[i].replace(/<li>(?:<.*>)?.*<\/a>(?:<\/.*>)?.-.|<\/li>$/g,'');

		//sessionStorageにSCPキー，SCP名を格納する
		sessionStorage.setItem(scpkey,scpname);
	}
}

if(sessionStorage.getItem(itemName)!=null){
	var scpinline=document.getElementById('page-title').innerHTML+sessionStorage.getItem(itemName);
	document.getElementById('page-title').innerHTML=scpinline;
}
