const { addSectionValidator ,updateSectionValidator } = require("./sectionValidators");
const { signUpAdminValidator ,loginAdminValidator } = require("./adminValidator");
const { addTeacherValidator,loginTeacherValidator, updateTeacherValidator} = require('./teacherValidator');
const { addClassValidator ,updateClassValidator } = require('./classValidator');
const { addStudentValidator,loginStudentValidator } = require("./studentValidator")
module.exports = {
    addSectionValidator,
    updateSectionValidator,
    signUpAdminValidator,
    loginAdminValidator,
    addTeacherValidator,
    loginTeacherValidator,
    updateTeacherValidator,
    addClassValidator,
    updateClassValidator,
    addStudentValidator,
    loginStudentValidator
}