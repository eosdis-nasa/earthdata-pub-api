module.exports.action = {
  primary: {
    pKey: 'id',
    pType: 'S'
  },
  action_name: {
    pKey: 'action_name',
    pType: 'S',
    sKey: 'version',
    sType: 'N'
  }
};

module.exports.communication = {
  primary: {
    pKey: 'id',
    pType: 'S'
  },
  recipient_id: {
    pKey: 'recipient_id',
    pType: 'S',
    sKey: 'timestamp',
    sType: 'N'
  },
  source_id: {
    pKey: 'source_id',
    pType: 'S',
    sKey: 'timestamp',
    sType: 'N'
  }
};

module.exports.daac = {
  primary: {
    pKey: 'id',
    pType: 'S'
  },
  short_name: {
    pKey: 'short_name',
    pType: 'S'
  }
};

module.exports.form = {
  primary: {
    pKey: 'id',
    pType: 'S'
  },
  id_scan: {
    pKey: 'id',
    pType: 'S',
    sKey: 'form_name',
    sType: 'S'
  },
  form_name: {
    pKey: 'form_name',
    pType: 'S',
    sKey: 'version',
    sType: 'N'
  }
};

module.exports.group = {
  primary: {
    pKey: 'id',
    pType: 'S'
  },
  group_name: {
    pKey: 'group_name',
    pType: 'S'
  }
};

module.exports.membership = {
  primary: {
    pKey: 'id',
    pType: 'S',
    sKey: 'group_id',
    sType: 'S'
  },
  group_id: {
    pKey: 'group_id',
    pType: 'S',
    sKey: 'id',
    sType: 'S'
  }
};

module.exports.note = {
  primary: {
    pKey: 'id',
    pType: 'S'
  },
  recipient_id: {
    pKey: 'recipient_id',
    pType: 'S',
    sKey: 'timestamp',
    sType: 'N'
  },
  source_id: {
    pKey: 'source_id',
    pType: 'S',
    sKey: 'timestamp',
    sType: 'N'
  }
};

module.exports.permission = {
  primary: {
    pKey: 'id',
    pType: 'S',
    sKey: 'entity_id',
    sType: 'S'
  },
  entity_id: {
    pKey: 'entity_id',
    pType: 'S',
    sKey: 'id',
    sType: 'S'
  }
};

module.exports.question = {
  primary: {
    pKey: 'id',
    pType: 'S'
  },
  id_scan: {
    pKey: 'id',
    pType: 'S',
    sKey: 'question_name',
    sType: 'S'
  },
  question_name: {
    pKey: 'question_name',
    pType: 'S',
    sKey: 'version',
    sType: 'N'
  }
};

module.exports.submission = {
  primary: {
    pKey: 'id',
    pType: 'S'
  },
  initiator_id_scan: {
    pKey: 'initiator_id',
    pType: 'S',
    sKey: 'daac_id',
    sType: 'S'
  },
  workflow_id_scan: {
    pKey: 'workflow_id',
    pType: 'S',
    sKey: 'initiator_id',
    sType: 'S'
  },
  daac_id_scan: {
    pKey: 'daac_id',
    pType: 'S',
    sKey: 'workflow_id',
    sType: 'S'
  },
  state_scan: {
    pKey: 'state',
    pType: 'S',
    sKey: 'daac_id',
    sType: 'S'
  }
};

module.exports.subscription = {
  primary: {
    pKey: 'id',
    pType: 'S',
    sKey: 'source_id',
    sType: 'S'
  },
  source_id: {
    pKey: 'source_id',
    pType: 'S',
    sKey: 'id',
    sType: 'S'
  }
};

module.exports.user = {
  primary: {
    pKey: 'id',
    pType: 'S'
  },
  email: {
    pKey: 'email',
    pType: 'S',
    sKey: 'user_name',
    sType: 'S'
  },
  user_name: {
    pKey: 'user_name',
    pType: 'S',
    sKey: 'email',
    sType: 'S'
  }
};

module.exports.workflow = {
  primary: {
    pKey: 'id',
    pType: 'S'
  },
  workflow_name: {
    pKey: 'workflow_name',
    pType: 'S',
    sKey: 'version',
    sType: 'N'
  },
  daac_id: {
    pKey: 'daac_id',
    pType: 'S',
    sKey: 'workflow_name',
    sType: 'S'
  }
};
