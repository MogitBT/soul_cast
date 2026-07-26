from fastapi import APIRouter

from app.data.seed_modes import MODE_CARDS

router = APIRouter()


@router.get("/modes")
async def list_modes() -> dict:
    return {
        "modes": [
            {
                "mode": mode.value,
                "label": card["label"],
                "tagline": card["tagline"],
                "shelf_copy": card["shelf_copy"],
                "accent": card["accent"],
                "roles": [role.value for role in card["roles"]],
            }
            for mode, card in MODE_CARDS.items()
        ]
    }
