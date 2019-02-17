import React, { Component, useState } from "react";
import restApiService from "../RestApiService";

class GestionEquipe extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      equipes: new Array(),
      newEquipeName: ""
    };
  }

  async componentDidMount() {
    await this.updateEquipes();
  }

  updateEquipes = async () => {
    const equipesData = await restApiService.getEquipes();
    this.setState({
      equipes: equipesData._embedded.equipes.sort(
        (a: any, b: any) => a.id - b.id
      )
    });
  };

  handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!this.state.newEquipeName) return;
    console.log(`création équipe ${this.state.newEquipeName}`);
    await restApiService.createEquipe({
      nom: this.state.newEquipeName
    });
    await this.updateEquipes();
    this.setState({ newEquipeName: "" });
  };

  handleInputChange = async (e: any) => {
    console.log(e.target.value);
    this.setState({
      newEquipeName: e.target.value
    });
  };

  render() {
    const creerEquipeForm = (
      <form onSubmit={this.handleSubmit}>
        <div className="form-row">
          <label htmlFor="name" className="col-3 m-auto text-right">
            Nom de l'équipe
          </label>
          <input
            id="name"
            type="text"
            className="form-control col"
            placeholder="ex: Ippi"
            value={this.state.newEquipeName}
            onChange={this.handleInputChange}
          />
          <button type="submit" className="btn btn-primary col-2 ml-2">
            Créer
          </button>
        </div>
      </form>
    );

    return (
      <div className="offset-sm-2 offset-2 col-8">
        {creerEquipeForm}
        {this.state.equipes.map((equipe: any, index: number) => {
          return (
            <ExistingEquipeForm
              name={equipe.nom}
              key={equipe.id}
              id={equipe.id}
              updateEquipes={this.updateEquipes}
            />
          );
        })}
      </div>
    );
  }
}

const ExistingEquipeForm = (props: any) => {
  const [equipeName, setEquipeName] = useState(props.name);
  const { updateEquipes } = props;

  const handleModification = async (e: any) => {
    e.preventDefault();
    console.log(`modification ${equipeName}`);
    await restApiService.updateEquipe(props.id, {
      nom: equipeName
    });
    alert(`Le nom ${equipeName} a bien été enregistré`);
    updateEquipes();
  };

  const handleSuppression = async (e: any) => {
    e.preventDefault();
    console.log(`suppression ${equipeName}`);
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer l'équipe ${equipeName} ?`
      )
    ) {
      await restApiService.deleteEquipe(props.id);
      alert(`L'équipe ${equipeName} a bien été supprimée`);
      updateEquipes();
    }
  };

  const handleInputChange = (e: any) => {
    console.log(e.target.value);
    setEquipeName(e.target.value);
  };

  return (
    <form className="mt-2">
      <div className="form-row">
        <label htmlFor="equipeName" className="col-3 m-auto text-right">
          Nom de l'équipe
        </label>
        <input
          id="equipeName"
          className="form-control col"
          type="text"
          value={equipeName}
          onChange={handleInputChange}
        />
        <button
          onClick={handleModification}
          className="btn btn-info col-2 ml-2"
        >
          Modifier
        </button>
        <button
          onClick={handleSuppression}
          className="btn btn-danger col-2 ml-2"
        >
          Supprimer
        </button>
      </div>
    </form>
  );
};

export default GestionEquipe;
