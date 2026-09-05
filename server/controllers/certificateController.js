const Certificate = require('../models/Certificate');

// @desc Get certificate by certificate ID or Mongo ID
// @route GET /api/certificates/:id
// @access Private/Public
exports.getCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({
      $or: [{ certificateId: req.params.id }, { _id: req.params.id }],
    })
      .populate('student', 'name email avatar')
      .populate('course', 'title category duration thumbnail')
      .populate('instructor', 'name headline avatar');

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate record not found' });
    }

    res.status(200).json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Public certificate verification lookup
// @route GET /api/certificates/verify/:certificateId
// @access Public
exports.verifyCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.certificateId })
      .populate('student', 'name')
      .populate('course', 'title')
      .populate('instructor', 'name');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: 'Invalid Certificate ID. Certificate could not be verified in LearnPulse registry.',
      });
    }

    res.status(200).json({
      success: true,
      verified: true,
      message: 'Certificate Verified Authenticated',
      data: {
        certificateId: certificate.certificateId,
        studentName: certificate.student.name,
        courseTitle: certificate.course.title,
        instructorName: certificate.instructor.name,
        issueDate: certificate.issueDate,
      },
    });
  } catch (error) {
    next(error);
  }
};
