const Paciente = require('../models/paciente');

const pacienteCtrl = {};

pacienteCtrl.getPacientes = async (req, res, next) => {
    const pacientes = await Paciente.find();
    res.json(pacientes);
};

pacienteCtrl.createPaciente = async (req, res, next) => {
    const paciente = new Paciente({

      // id: number, title: string, state: string, url: string, created_at: string, updated_at: string
        id: req.body.id,
        title: req.body.title,
        state: req.body.state,
        url: req.body.url

    });
    console.log("TITLE " + title);
    await paciente.save();
    res.json({status: 'paciente created'});
};

pacienteCtrl.getPaciente = async (req, res, next) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);
    res.json(paciente);
};

pacienteCtrl.editPaciente = async (req, res, next) => {
    const { id } = req.params;
    const paciente = {
        name: req.body.name,
        position: req.body.position,
        office: req.body.office,
        salary: req.body.salary
    };
    await Paciente.findByIdAndUpdate(id, {$set: paciente}, {new: true});
    res.json({status: 'paciente Updated'});
};

pacienteCtrl.deletePaciente = async (req, res, next) => {
    await Paciente.findByIdAndRemove(req.params.id);
    res.json({status: 'paciente Deleted'});
};

module.exports = pacienteCtrl;
