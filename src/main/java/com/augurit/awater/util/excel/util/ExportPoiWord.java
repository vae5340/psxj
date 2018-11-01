package  com.augurit.awater.util.excel.util;

import org.apache.poi.poifs.filesystem.POIFSFileSystem;

import java.io.*;
import java.util.Map;


public class ExportPoiWord {
	// 标题
	private static final String style = "<div style=\"text-align: center\"><span style=\"font-size: 24px\"><span style=\"font-family: 黑体\">"
									+"${title}<br/><br/></span></span></div>";
	// 页面显示设置
	private static final String xmlContent = "<html xmlns:v='urn:schemas-microsoft-com:vml'xmlns:" +
			"o='urn:schemas-microsoft-com:office:office'xmlns:w='urn:schemas-microsoft-com:" +
			"office:word'xmlns:m='http://schemas.microsoft.com/office/2004/12/omml'xmlns=" +
			"'http://www.w3.org/TR/REC-html40'  xmlns='http://www.w3.org/1999/xhtml'>" +
			"<head>"+
			"<xml><w:WordDocument><w:View>Print</w:View><w:TrackMoves>false" +
			"</w:TrackMoves><w:TrackFormatting/><w:ValidateAgainstSchemas/><w:SaveIfXMLInvalid>false" +
			"</w:SaveIfXMLInvalid><w:IgnoreMixedContent>false</w:IgnoreMixedContent><w:AlwaysShowPlaceholderText>false" +
			"</w:AlwaysShowPlaceholderText><w:DoNotPromoteQF/><w:LidThemeOther>EN-US</w:LidThemeOther><w:LidThemeAsian>ZH-CN" +
			"</w:LidThemeAsian><w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript><w:Compatibility><w:BreakWrappedTables/>" +
			"<w:SnapToGridInCell/><w:WrapTextWithPunct/><w:UseAsianBreakRules/><w:DontGrowAutofit/><w:SplitPgBreakAndParaMark/>" +
			"<w:DontVertAlignCellWithSp/><w:DontBreakConstrainedForcedTables/><w:DontVertAlignInTxbx/><w:Word11KerningPairs/>" +
			"<w:CachedColBalance/><w:UseFELayout/></w:Compatibility><w:BrowserLevel>MicrosoftInternetExplorer4</w:BrowserLevel>" +
			"<m:mathPr><m:mathFont m:val=\"Cambria Math\"/><m:brkBin m:val=\"before\"/><m:brkBinSub m:val=\"--\"/><m:smallFrac m:val=\"off\"/>" +
			"<m:dispDef/><m:lMargin m:val=\"0\"/> <m:rMargin m:val=\"0\"/>" +
			"<m:defJc m:val=\"centerGroup\"/><m:wrapIndent m:val=\"1440\"/><m:intLim m:val=\"subSup\"/><m:naryLim m:val=\"undOvr\"/>" +
			"</m:mathPr></w:WordDocument></xml>"+
			"</head>";
			
	
   public static File exportWord(Map<String, Object> map,String fileName) throws Exception {
        try {     
        		String content = xmlContent;
        		//标题
                content+=style.replace("${title}", map.get("title").toString());
                //内容
                if(map.get("content").toString().contains("class=\"p_content\"")){
                	content+=map.get("content").toString().replace("class=\"p_content\"", "style=\"text-indent:3em;font-size: 21px;font-family: '宋体';text-justify:inter-ideograph;Line-height:37px\"");
                }else if(map.get("content").toString().contains("class='p_content'")){
                	content+=map.get("content").toString().replace("class='p_content'", "style=\"text-indent:3em;font-size: 21px;font-family: '宋体';text-justify:inter-ideograph;Line-height:37px\"");
                }else{
                	content+=map.get("content").toString();
                }
                content += "</html>";  
                byte b[] = content.getBytes("GBK");    
                InputStream bais = new ByteArrayInputStream(b); 
                File file = new File(fileName);
                OutputStream os = new FileOutputStream(file);
                POIFSFileSystem poifs = new POIFSFileSystem();
                poifs.createDocument(bais, "WordDocument");
                poifs.writeFilesystem(os);
                os.close();
                bais.close();
                return file;
        } catch (IOException e) {    
            e.printStackTrace();  
            return null;
        }
    }  
}
