package com.augurit.awater.upload.web;

import com.augurit.agcloud.bsc.domain.BscAttForm;
import com.augurit.agcloud.bsc.sc.att.service.IBscAttService;
import com.augurit.agcloud.bsc.sc.init.service.BscInitService;
import com.augurit.agcloud.framework.security.SecurityContext;
import com.augurit.agcloud.framework.ui.result.ResultForm;
import com.augurit.awater.bpm.file.entity.SysFileLink;
import com.augurit.awater.bpm.file.service.IDynamictableService;
import com.augurit.awater.bpm.file.service.ISysFileService;
import com.augurit.awater.bpm.file.web.form.SysFileForm;
import com.augurit.awater.bpm.problem.service.ICcProblemService;
import com.augurit.awater.util.file.SysFileUtils;
import net.coobird.thumbnailator.Thumbnails;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/uploadfile")
public class UploadfileController {

    @Autowired
    protected BscInitService bscInitService;
    @Autowired
    protected IBscAttService bscAtService;

    public static String IMG_SMALL="imgsmall";

    @RequestMapping("/uploadFile")
    public ResultForm uploadFile(MultipartHttpServletRequest request, String fileParam){
        try {
            String tableName = request.getParameter("tableName");
            String pkName = request.getParameter("pkName");
            String recordId = request.getParameter("recordId");
            String attType = request.getParameter("attType");
            String isDbStore = request.getParameter("isDbStore");
            String isEncrypt = request.getParameter("isEncrypt");
            String orgId = SecurityContext.getCurrentOrgId();
            BscAttForm form = this.buildNewAtForm("", tableName, pkName, recordId, attType, isDbStore, isEncrypt);
            form.setOrgId(orgId);

            String filePath = form.getAttPath();
            if(StringUtils.isNotBlank(tableName) && StringUtils.isNotBlank(pkName) && StringUtils.isNotBlank(recordId)) {
                File directory = new File(filePath);//如果文件夹不存在则创建
                if (!directory.exists()) {
                    directory.mkdirs();
                }
            }
            String fileFileName = request.getFile(fileParam).getOriginalFilename();
            String filename = fileFileName.substring(0,fileFileName.lastIndexOf('.'));
            String fileformat = fileFileName.substring(fileFileName.lastIndexOf('.') + 1, fileFileName.length());
            form.setAttFormat(fileformat);
            form.setAttName(fileFileName);
            form.setAttDiskName(form.getAttCode() + "." + form.getAttFormat());
            String fileNewName=form.getAttDiskName();
            File file = new File(filePath, fileNewName);
            List<MultipartFile>list = request.getFiles("file");
            request.getFile(fileParam).transferTo(file);

            Long filesize = file.length();
            form.setAttSize(filesize+"");
            String filetype = "0";
			// 缩略图 start
			// 缩略图地址
			String smallpicPath=filePath+File.separator+IMG_SMALL;
			String picThumbnailUrl=smallpicPath+File.separator+fileNewName;
			File sf = new File(smallpicPath);
			if(!sf.isDirectory()){
				sf.mkdirs();
			}
			Thumbnails.of(filePath+File.separator+fileNewName)
			.scale(0.4f)
			.toFile(picThumbnailUrl); 
		  // 缩略图 end


            form.setMemo1("ycy测试");
            bscAtService.saveAtt(form,SecurityContext.getCurrentUser().getLoginName());
            return new ResultForm(true);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResultForm(false);
        }
    }

    protected BscAttForm buildNewAtForm(String dirId, String tableName,String pkName, String recordId , String atType, String isDbStore, String isEncrypt) {
        String configPathDefault = this.bscInitService.getConfigValueByConfigKey("uploadPath");
        String isDbStroDefault = this.bscInitService.getConfigValueByConfigKey("isDbStore");
        String isEncryptDefault = this.bscInitService.getConfigValueByConfigKey("isEncrypt");
        String isreDefault = this.bscInitService.getConfigValueByConfigKey("isRelative");
        String iniencryptClass = this.bscInitService.getConfigValueByConfigKey("encryptClassFullName");
        BscAttForm form = new BscAttForm();
        form.setDirId(dirId);
        form.setTableName(tableName);
        form.setEncryptClass(iniencryptClass);
        form.setRecordId(recordId);
        form.setPkName(pkName);
        form.setAttCode((new Date()).getTime() + "");
        //form.setAttName(attachment.getOriginalFilename());
        form.setAttPath(configPathDefault + File.separator+ tableName +File.separator+pkName+ File.separator + recordId);
        form.setAttType(atType);
        //form.setAttSize(String.valueOf(attachment.getSize()));
        //form.setAttFormat(attachment.getOriginalFilename().substring(attachment.getOriginalFilename().lastIndexOf(".") + 1));
        form.setIsDbStore(isDbStore == null || !"0".equals(isDbStore) && !"1".equals(isDbStore) ? isDbStroDefault : isDbStore);
        form.setIsEncrypt(isEncrypt == null || !"0".equals(isEncrypt) && !"1".equals(isEncrypt) ? isEncryptDefault : isEncrypt);
        form.setIsRelative(isreDefault);
        //form.setAttDiskName(form.getAttCode() + "." + form.getAttFormat());
        return form;
    }


}
