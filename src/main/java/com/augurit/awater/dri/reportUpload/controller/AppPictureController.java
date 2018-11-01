package com.augurit.awater.dri.reportUpload.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;


@RequestMapping("/appPicture")
@Controller
public class AppPictureController {
    private static final String ATTACHMENT_LIST_IFRAME = "ATTACHMENT_LIST_IFRAME";
    private static final String EDIT_OFFICE_DOC = "EDIT_OFFICE_DOC";
    private static final String EDIT_FORM_AND_DOC = "EDIT_FORM_AND_DOC";
    private static final String CONTENT_TYPE = "text/html; charset=UTF-8";

    @RequestMapping(value = "/batchDownload",produces="text/plain;charset=UTF-8")
    @ResponseBody
    public String batchDownload() throws Exception {
        /*String servPath = BaseAction.getAbsolutePath();
        String fileName = "下载附件.zip";
        String uploadDir = this.sysConfigService.getConfigValue("WEB_UPLOAD_PATH");
        List<SysFileForm> sysFileList = this.sysFileService.getSysFiles(this.sysFileIds);
        String uploadAbsolutePath = this.sysConfigService.getConfigValue("IS_UPLOAD_ABSOLUTE_PATH");
        boolean isAbsolutePath = uploadAbsolutePath != null && !uploadAbsolutePath.equalsIgnoreCase("0");
        if (!isAbsolutePath) {
            uploadDir = servPath + uploadDir.replace("\\", "/");
        }

        SysFileUtils.zipFile(sysFileList, uploadDir, fileName, getRequest());
        InputStream in = null;
        ServletOutputStream ou = null;

        try {
            File file = new File(uploadDir + "/" + fileName);
            getResponse().reset();
            getResponse().setContentType("application/octet-stream");
            fileName = FileUtils.reEncodeChineseFileName(fileName, getRequest());
            getResponse().setHeader("Content-Disposition", "attachment; filename=" + fileName);
            in = new BufferedInputStream(new FileInputStream(file), 2048);
            ou = getResponse().getOutputStream();
            byte[] buffer = new byte[2048];
            boolean var11 = false;

            int n;
            while((n = in.read(buffer)) != -1) {
                ou.write(buffer, 0, n);
            }
        } catch (Exception var20) {
            var20.printStackTrace();
        } finally {
            closeIO(in,ou);
        }*/

        return null;
    }
   /* private void closeIO(InputStream in, OutputStream out){
        try {
            if(in != null)
                in.close();
            if(out != null)
                out.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @RequestMapping(value = "/list")
    public String list() throws Exception {
        ExtUtils.initPageFromExtGridParam(getRequest(), this.page);
        this.sysFileService.searchImg(this.page, this.form);
        if(null!=this.page.getResult()) {
            for (SysFileForm sysFileForm : page.getResult()) {
                setImgURL(sysFileForm);
            }
        }
        extRenderGridJson(this.page);
        return null;
    }


    public String input() throws Exception {
        setImgURL(this.form);
        extRenderFormJson(this.form);
        return null;
    }

    //设置图片url
    private void setImgURL(SysFileForm sysFileForm){
        if(null!=sysFileForm){
            if(null!=sysFileForm.getFilePath())
                sysFileForm.setFilePath(sysFileForm.getFilePath().replace('\\','/'));
            StringBuilder imgUrl=new StringBuilder();
            HttpServletRequest request=getRequest();
            imgUrl.append("http://").append(request.getServerName()).append(":").append(request.getServerPort()).append(request.getContextPath())
                    .append(sysFileForm.getFilePath()).append("/").append(sysFileForm.getFileName()).append(".").append(sysFileForm.getFileFormat());
            sysFileForm.setFilePath(imgUrl.toString());
            sysFileForm.setFilePath(imgUrl.toString());
        }
    }

    public String save() throws Exception {
        this.sysFileService.saveSysFile(this.form, this.getLoginUser().getUserName(),true);
        extRenderSuccess();
        return null;
    }

    public String delete() throws Exception {
        for(int i = 0; i < this.sysFileIds.length; ++i) {
            this.delete2(this.sysFileService.getSysFile(this.sysFileIds[i]));
        }

        return null;
    }

    *//**
     * 删除附件记录及其服务器磁盘上的物理文件
     * @param form 附件对象
     * @return true表示删除成功，false表示删除失败
     *//*
    public boolean delete2(SysFileForm form) {
        boolean result = false;

        if (form != null) {

            //删除服务器磁盘上的附件文件
            boolean success = deleteFile(form.getFilePath(), form.getFileCode() + "." + form.getFileFormat(), false);

            //删除附件记录
            if (success) {
                sysFileService.deleteSysFile(form.getSysFileId());
                result = true;
            }
        }

        return result;
    }

    public String readAttachment() throws Exception {
        File file = null;
        String directoryPath;
        String filePath;
        String fileName;
        if (this.sysFileId != null) {
            directoryPath = BaseAction.getAbsolutePath();
            filePath = this.form.getFilePath();
            fileName = this.sysConfigService.getConfigValue("IS_UPLOAD_ABSOLUTE_PATH");
            boolean isAbsolutePath = fileName != null && !fileName.equalsIgnoreCase("0");
             fileName = this.form.getFileCode() + "_" + this.form.getFileName() + "." + this.form.getFileFormat();
            String attachmentType = this.sysConfigService.getConfigValue("ATTACH_UPLOAD_TYPE");
            if (StringUtils.isNotBlank(attachmentType)) {
                SysFileUtils.ATTACH_UPLOAD_TYPE = attachmentType.trim();
            }

            if (!SysFileUtils.ATTACH_UPLOAD_TYPE.equals("code_name")) {
                fileName = this.form.getFileCode() + "." + this.form.getFileFormat();
            }

            file = FileUtils.openFile(filePath, fileName, isAbsolutePath, directoryPath, true, true);
        } else {
            directoryPath = BaseAction.getAbsolutePath();
            filePath = directoryPath + "/" + "resources/components/ntko/docs/blank.doc";
            file = new File(filePath);
        }

        directoryPath = null;
        filePath = null;
        BaseAction.getResponse().reset();
        BaseAction.getResponse().setContentType("application/octet-stream");
        if (this.form.getFileName() != null) {
            fileName = FileUtils.reEncodeChineseFileName(this.form.getFileName(), BaseAction.getRequest());
            BaseAction.getResponse().setHeader("Content-Disposition", "attachment; filename=" + fileName);
        }

        InputStream in = new BufferedInputStream(new FileInputStream(file), 2048);
        ServletOutputStream out = BaseAction.getResponse().getOutputStream();
        FileUtils.copy(in, out);
        return null;
    }

    public String uploadAttachment() throws Exception {
        boolean success = this.upload(this.form, this.document);
        if (success) {
            extRenderSuccess();
        } else {
            extRenderFailture();
        }

        return null;
    }

    public String saveFormAndAttachment() throws Exception {
        ResultForm result = this.saveFormAndAttachment(this.form, this.document);
        renderJson(result, new String[]{"encoding:GBK"});
        return null;
    }

    public String editOfficeDoc() throws Exception {
        return "EDIT_OFFICE_DOC";
    }

    public String editFormAndDoc() throws Exception {
        String directoryPath = getApplication().getRealPath("/");
        if (!FileUtils.isFileExist(this.form.getFilePath(), this.form.getFileName(), false, directoryPath, true)) {
            this.form.setIsAttachmentContentChange(true);
        }

        return "EDIT_FORM_AND_DOC";
    }

    public String saveAsHtml() throws Exception {
        FileUtils.changeToHtml(this.form);
        boolean success = this.upload(this.form, this.document);
        if (success) {
            renderText("已成功另存为HTML文件！", new String[]{"encoding:GBK"});
        } else {
            renderText("另存为HTML文件失败！", new String[]{"encoding:GBK"});
        }

        return null;
    }

    public String saveAsPdf() throws Exception {
        FileUtils.changeToPdf(this.form);
        boolean success = this.upload(this.form, this.document);
        if (success) {
            renderText("已成功另存为PDF文件！", new String[]{"encoding:GBK"});
        } else {
            renderText("另存为PDF文件失败！", new String[]{"encoding:GBK"});
        }

        return null;
    }

    public String addAttachment() throws Exception {
        List<Attachment> attachments = this.getAttachmentList();
        if (attachments != null) {
            Iterator var3 = attachments.iterator();
            while(var3.hasNext()) {
                Attachment attachment = (Attachment)var3.next();
                //上传的图片不能超过500KB
                if((attachment.getFile().length()/1024)>500){
                    renderJson("{\"success\":false,\"msg\":overSize}");
                    return null;
                }
                boolean success = this.upload2(this.form, attachment);
                if (!success) {
                    renderText("上传图片失败", new String[]{"encoding:GBK"});
                    return null;
                }
            }
        }
        renderJson("{\"success\":true}");
        return null;
    }

    public void checkStartImg() throws  Exception{
        List<SysFile> sysFiles=sysFileService.getActiveStartImg();
        //存在返回false
        if(null!=sysFiles&&sysFiles.size()>0){
            extRenderFailture();
            return;
        }
        extRenderSuccess();
    }

    public String addAttachmentForSwfupload() throws Exception {
        List<Attachment> attachments = this.getAttachmentList();
        if (attachments != null) {
            Iterator var3 = attachments.iterator();

            while(var3.hasNext()) {
                Attachment attachment = (Attachment)var3.next();
                boolean success = this.upload(this.form.getEntity(), this.form.getEntityId(), this.form.getFilePath(), (String)null, (String)null, (String)null, attachment);
                if (!success) {
                    throw new RuntimeException();
                }
            }
        }

        renderText("successed", new String[0]);
        return null;
    }

    public String deleteAttachment() throws Exception {
        boolean success = this.delete(this.sysFileId);
        if (!success) {
            renderText("删除附件失败", new String[]{"encoding:GBK"});
            return null;
        } else {
            this.redirectUrl = getRootPath() + this.redirectUrl;
            return "reload";
        }
    }

    public String deleteMoreAttachment() throws Exception {
        if (this.sysFileIds != null && this.sysFileIds.length > 0) {
            Long[] var4 = this.sysFileIds;
            int var3 = this.sysFileIds.length;

            for(int var2 = 0; var2 < var3; ++var2) {
                Long id = var4[var2];
                boolean success = this.delete(id);
                if (!success) {
                    renderText("删除附件失败", new String[]{"encoding:GBK"});
                    return null;
                }
            }
        }

        this.redirectUrl = getRootPath() + this.redirectUrl;
        return "reload";
    }

    public String showAttachmentsIframe() throws Exception {
        return "ATTACHMENT_LIST_IFRAME";
    }


    protected void prepareModel() throws Exception {
        if (this.sysFileId != null) {
            this.form = this.sysFileService.getSysFile(this.sysFileId);
        } else {
            this.form = new SysFileForm();
        }

    }*/

}
