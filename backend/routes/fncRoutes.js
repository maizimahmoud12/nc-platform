const express = require('express');
const { readCases, writeCases } = require('../utils/fileDb');

const router = express.Router();

router.get('/', (req, res) => {
  const cases = readCases();
  res.json(cases);
});

router.get('/:id', (req, res) => {
  const cases = readCases();
  const item = cases.find(c => c.id === req.params.id);

  if (!item) {
    return res.status(404).json({ message: 'Fiche introuvable' });
  }

  res.json(item);
});

router.post('/', (req, res) => {
  const cases = readCases();
  const body = req.body || {};

  const created = {
    id: `FNC-${Date.now()}`,
    numero: body.numero || '',
    lieuEmission: body.lieuEmission || '',
    origine: Array.isArray(body.origine) ? body.origine : [],
    natureEcart: Array.isArray(body.natureEcart) ? body.natureEcart : [],
    autreNature: body.autreNature || '',
    descriptionEvenement: body.descriptionEvenement || '',
    activitesConcernees: Array.isArray(body.activitesConcernees) ? body.activitesConcernees : [],
    emetteurNom: body.emetteurNom || '',
    emetteurVisa: body.emetteurVisa || '',
    emetteurDate: body.emetteurDate || '',
    traitementImmediat: body.traitementImmediat || '',
    causes: Array.isArray(body.causes) ? body.causes : [],
    rechercheCauses: body.rechercheCauses || '',
    responsableActivite: body.responsableActivite || '',
    responsableVisa: body.responsableVisa || '',
    responsableDate: body.responsableDate || '',
    actionsCorrectives: body.actionsCorrectives || '',
    actionsPreventives: body.actionsPreventives || '',
    evaluationRisques: body.evaluationRisques || 'acceptable-surveillance',
    methodeSuivre: body.methodeSuivre || '5M',
    miseEnOeuvre: body.miseEnOeuvre || 'acceptable',
    verificateurNom: body.verificateurNom || '',
    verificateurVisa: body.verificateurVisa || '',
    verificateurDate: body.verificateurDate || '',
    coutNC: body.coutNC || '',
    createdAt: new Date().toISOString().slice(0, 10),
    statut: body.statut || 'nouveau'
  };

  cases.push(created);
  writeCases(cases);
  res.status(201).json(created);
});

router.patch('/:id', (req, res) => {
  const cases = readCases();
  const index = cases.findIndex(c => c.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Fiche introuvable' });
  }

  cases[index] = {
    ...cases[index],
    ...req.body,
    id: cases[index].id
  };

  writeCases(cases);
  res.json(cases[index]);
});

router.put('/:id', (req, res) => {
  const cases = readCases();
  const index = cases.findIndex(c => c.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Fiche introuvable' });
  }

  cases[index] = {
    ...cases[index],
    ...req.body,
    id: cases[index].id
  };

  writeCases(cases);
  res.json(cases[index]);
});

module.exports = router;